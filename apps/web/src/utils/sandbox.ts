class ListNode<T> {
	next: ListNode<T> | null;
	value: T;
	#length: number;

	constructor(value: T) {
		this.value = value;
		this.next = null;
		this.#length = 1;
	}

  /**
   * 链表长度
   */
	get length() {
		return this.#length;
	}

	/**
	 * 获取链表最后一个节点
	 * @returns 最后一个链表节点
	 */
	last(): ListNode<T> {
		if (!this.next) return this;
		const last = this.next.last();
		return last;
	}

	/**
	 * 根据符合条件寻找链表中的一个值
	 * @param isFound 判断符合条件的节点值函数
	 * @returns 符合条件的节点值或者 null (找不到)
	 */
	find(isFound: (value: T) => boolean): T | null {
		if (!this.next) return null;
		if (isFound(this.value)) return this.value;
		const foundValue = this.next.find(isFound);
		return foundValue;
	}

	/**
	 * 遍历链表
	 * @param callback 对于每个节点的回调
	 * @param reversed 反向遍历
	 */
	traverse(callback: (value: T) => void, reversed: boolean = false): void {
		!reversed && callback(this.value);
		this.next?.traverse(callback, reversed);
		reversed && callback(this.value);
	}

	/**
	 * 向链表末尾添加一个值
	 * @param value 添加到链表末尾的值
	 * @returns 链表本身
	 */
	push(value: T): ListNode<T> {
		this.#length += 1;
		if (!this.next) this.next = new ListNode(value);
		else this.next.push(value);
		return this;
	}

	/**
	 * 反转链表
	 * @returns 反转后的链表
	 */
	reverse(): ListNode<T> {
		if (!this.next) return this;
		const last = this.next.reverse();
		this.next.next = this;
		this.next = null;
		return last;
	}
}

export default ListNode;
