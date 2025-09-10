// max heap class
class MaxHeap {
    constructor(songs = []) {
        this.heap = [];
        // build heap from existing songs
        songs.forEach(song => this.insert(song));
    }

    insert(song) {
        this.heap.push(song);
        this.swim(this.heap.length - 1);
    }

    swim(index) {
        if (index === 0) return;

        const parentIndex = Math.floor((index - 1) / 2);
        if (this.heap[parentIndex].rating < this.heap[index].rating) {
            // swap with parent
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            this.swim(parentIndex);
        }
    }

    getHeapArray() {
        return this.heap;
    }
}

export default MaxHeap;