/**
 * Priorty Queue Implementation using a Min Heap
 * Uniquely stringifiable node objects and their cost/values can be stored
 * Will always return the currently stored node with the lowest cost
 */
class PriorityQueue {
  constructor() {
    this.heap = [];
    this.nodeToIndex = {};
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  // Add node to Priority Queue
  add(node, value) {
    this.heap.push([node, value]);
    this.nodeToIndex[JSON.stringify(node)] = this.heap.length - 1;
    // Sift added node up into correct position:
    this.siftUp(this.heap.length - 1);
  }

  // Return and remove the highest priority (lowest value) item from queue
  remove() {
    if (this.isEmpty()) return;

    // Swap 0-index node with last node in heap:
    this.swap(0, this.heap.length - 1);
    // Remove and delete the node we are removing
    const [node, value] = this.heap.pop();
    delete this.nodeToIndex[JSON.stringify(node)];
    // Sift the swapped node down to correct position in heap:
    this.siftDown(0);
    return [node, value];
  }

  // Update node value in Heap and move it to correct position in queue:
  update(node, value) {
    const nodeStr = JSON.stringify(node);
    if (!(nodeStr in this.nodeToIndex)) {
      return;
    }
    // Update node value and sift it up to correct position
    // This assumes the node value will be updated to a lower value
    this.heap[this.nodeToIndex[nodeStr]] = [node, value];
    this.siftUp(this.nodeToIndex[nodeStr]);
  }

  // Swap position of two nodes in heap and nodeToIndex Obj
  swap(index1, index2) {
    // Swap indices held in nodeToIndex object
    this.nodeToIndex[JSON.stringify(this.heap[index1][1])] = index2;
    this.nodeToIndex[JSON.stringify(this.heap[index2][1])] = index1;

    // Swap node and value positions in heap:
    const temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp;
  }

  // Sift given node in heap down to its correct position:
  siftDown(currInd) {
    let childOneInd = currInd * 2 + 1;
    while (childOneInd < this.heap.length) {
      const childTwoInd =
        childOneInd + 1 < this.heap.length ? childOneInd + 1 : null;
      // Swap value at current index with the child with the smaller value
      if (
        childTwoInd !== null &&
        this.heap[childTwoInd][1] < this.heap[childOneInd][1] &&
        this.heap[childTwoInd][1] < this.heap[currInd][1]
      ) {
        this.swap(currInd, childTwoInd);
        currInd = childTwoInd;
        childOneInd = currInd * 2 + 1;
      } else if (this.heap[childOneInd][1] < this.heap[currInd][1]) {
        this.swap(currInd, childOneInd);
        currInd = childOneInd;
        childOneInd = currInd * 2 + 1;
      } else {
        // No swap required, finished sifting:
        return;
      }
    }
  }

  // Sift given node up the heap to its correct position
  siftUp(currInd) {
    let parentInd = Math.floor((currInd - 1) / 2);
    while (currInd > 0 && this.heap[currInd][1] < this.heap[parentInd][1]) {
      this.swap(currInd, parentInd);
      currInd = parentInd;
      parentInd = Math.floor((currInd - 1) / 2);
    }
  }
}

// Priority Queue Test Cases:
// const test = new PriorityQueue();
// console.log(test.isEmpty()); // true;
// test.add({ hi: 'hello' }, 5);
// test.add({ yo: 'hello' }, 2);
// test.add({ bye: 'goodbye' }, 1);

// console.log(test.isEmpty()); // false;
// console.log(test.remove()); // [{ bye: 'goodbye' }, 1]
// console.log(test.remove()); // [{ yo: 'hello' }, 2]
// console.log(test.remove()); // [{ hi: 'hello' }, 5]
// console.log(test.isEmpty()); // true;

// test.add({ hi: 'hello' }, 5);
// test.add({ yo: 'hello' }, 2);
// test.add({ bye: 'goodbye' }, 1);
// test.update({ hi: 'hello' }, -1);
// test.update({ bye: 'goodbye' }, 10);

// console.log(test.remove()); // [{ hi: 'hello' }, -1]
// console.log(test.remove()); // [{ yo: 'hello' }, 2]
// console.log(test.remove()); // [{ bye: 'goodbye' }, 10]
