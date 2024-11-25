import { writable } from "svelte/store";
import { currentTime, player } from "./player";
import type { QueueItem, Session } from "$lib/types";

export const queueIndex = writable(-1);
export const queue = createQueueIndex();

function createQueueIndex() {
	let queueIndexValue = -1;

	let queueValue: QueueItem[] = [];
	const innerQueue = writable(queueValue);

	function next(plus: boolean = true) {
		if (plus) {
			queueIndexValue += 1;
		}

		if (queueIndexValue >= queueValue.length) {
			queueIndexValue = -1;
			return;
		}

		queueIndex.set(queueIndexValue);

		const item = queueValue[queueIndexValue];
		player.playAudio(item.url, item);
	}

	function prev() {
		queueIndexValue -= 1;

		if (queueIndexValue < 0) {
			queueIndexValue = queueValue.length - 1;
		}

		queueIndex.set(queueIndexValue);

		const item = queueValue[queueIndexValue];
		player.playAudio(item.url, item);
	}

	// function hasNext(): boolean {
	//     return (queueIndexValue + 1) < queueValue.length;
	// }

	function seektoIndex(index: number) {
		queueIndexValue = index;
		queueIndex.set(index);

		const item = queueValue[queueIndexValue];
		player.playAudio(item.url, item);
	}

	function addToQueue(item: QueueItem) {
		queueValue.push(item);
		innerQueue.set(queueValue);

		if (!player.isPlaying()) {
			if (queueIndexValue === -1 && queueValue.length > 1) {
				queueIndexValue = queueValue.length - 2;
			}

			next();
		}
	}

	async function removeFromQueue(index: number) {
		if (queueValue.length === 0) {
			return;
		} else if (index >= queueValue.length) {
			return;
		} else if (index < 0) {
			return;
		}

		queueValue.splice(index, 1);
		innerQueue.set(queueValue);

		if (queueIndexValue == index) {
			next(false);

			await fetch("/save-playlist", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(queue.getSession())
			});
		}
	}

	function getSession(): Session {
		return {
			current_time: player.currentTime(),
			current_index: queueIndexValue,
			queue: queueValue,
		}
	}

	function setSession(session: Session) {
		queueIndexValue = session.current_index;
		queueValue = session.queue;
		queueIndex.set(queueIndexValue);
		innerQueue.set(session.queue);

		const item = queueValue[queueIndexValue];
		console.log(session);
		player.playAudio(item.url, item, session.current_time);
	}

	function setQueue(newValue: QueueItem[]) {
		if (newValue.length === 0) {
			return;
		}

		queueIndexValue = -1;
		queueValue = newValue;
		queueIndex.set(queueIndexValue);
		innerQueue.set(newValue);

		next();
	}

	function clearQueue() {
		queueIndexValue = -1;
		queueValue = [];
		queueIndex.set(queueIndexValue);
		innerQueue.set(queueValue);
	}

	return {
		next,
		prev,
		seektoIndex,
		addToQueue,
		removeFromQueue,
		getSession,
		setSession,
		setQueue,
		clearQueue,
		subscribe: innerQueue.subscribe
	};
}
