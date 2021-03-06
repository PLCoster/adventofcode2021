/**
 * Priorty Queue Implementation using a Min Heap
 * Takes values of nodes as strings, with an associated value / cost
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
    this.nodeToIndex[node] = this.heap.length - 1;
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
    delete this.nodeToIndex[node];
    // Sift the swapped node down to correct position in heap:
    this.siftDown(0);
    return [node, value];
  }

  // Update node value in Heap and move it to correct position in queue:
  update(node, value) {
    if (!(node in this.nodeToIndex)) {
      return;
    }
    // Update node value and sift it up to correct position
    // This assumes the node value will be updated to a lower value
    this.heap[this.nodeToIndex[node]] = [node, value];
    this.siftUp(this.nodeToIndex[node]);
  }

  // Swap position of two nodes in heap and nodeToIndex Obj
  swap(index1, index2) {
    // Swap indices held in nodeToIndex object
    this.nodeToIndex[this.heap[index1][0]] = index2;
    this.nodeToIndex[this.heap[index2][0]] = index1;

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

  // Returns the current cost of a node if it is in the PQ, else -1;
  contains(node) {
    if (!(node in this.nodeToIndex)) return -1;
    return this.heap[this.nodeToIndex[node]][1];
  }
}

// Priority Queue Test Cases:
// const test = new PriorityQueue();
// console.log(test.isEmpty()); // true;
// test.add('hi', 5);
// test.add('hello', 2);
// test.add('goodbye', 1);

// console.log(test.isEmpty()); // false;
// console.log(test.remove()); // ['goodbye', 1]
// console.log(test.remove()); // ['hello', 2]
// console.log(test.remove()); // ['hello', 5]
// console.log(test.isEmpty()); // true;

// test.add('hi', 5);
// test.add('hello', 2);
// test.add('goodbye', 1);

// test.update('hello', -1);
// test.update('goodbye', 10);

// console.log('Heap: \n: ', test.heap, 'Obj: \n: ', test.nodeToIndex);

// console.log(test.contains('goodbye')); // 10
// console.log(test.contains('hello')); // -1
// console.log(test.contains('hi')); // 5

// console.log(test.remove()); // ['hello', -1]
// console.log(test.remove()); // ['hi', 5]
// console.log(test.remove()); // ['goodbye', 10]

module.exports = PriorityQueue;
