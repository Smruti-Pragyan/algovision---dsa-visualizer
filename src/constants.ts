export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface AlgorithmInfo {
  title: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stability?: string;
  inPlace?: string;
  adaptive?: string;
  pseudocode: string;
  industryUse: string;
  detailedExplanation?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  optimizedCode: string;
  javaCode?: string;
  pythonCode?: string;
  cppCode?: string;
  csharpCode?: string;
  quiz?: QuizQuestion[];
  tips?: string[];
  practiceQuestions?: {
    title: string;
    description: string;
    solutionLink?: string;
  }[];
  externalLinks?: {
    title: string;
    url: string;
  }[];
}

export const ROADMAP = [
  {
    id: 'sorting',
    title: 'Sorting',
    description: 'Learn how to arrange data in a specific order.',
    algorithms: [
      { id: 'bubble-sort', category: 'sorting' },
      { id: 'selection-sort', category: 'sorting' },
      { id: 'insertion-sort', category: 'sorting' },
      { id: 'merge-sort', category: 'sorting' },
      { id: 'quick-sort', category: 'sorting' },
    ],
  },
  {
    id: 'searching',
    title: 'Searching',
    description: 'Efficiently locate elements within data structures.',
    algorithms: [
      { id: 'linear-search', category: 'searching' },
      { id: 'binary-search', category: 'searching' },
    ],
  },
  {
    id: 'linked-lists',
    title: 'Linked Lists',
    description: 'Master dynamic data structures with nodes and pointers.',
    algorithms: [
      { id: 'linked-list', category: 'linked-lists' },
    ],
  },
  {
    id: 'linear',
    title: 'Stacks & Queues',
    description: 'Master LIFO and FIFO data management.',
    algorithms: [
      { id: 'stack', category: 'stacks-queues' },
      { id: 'queue', category: 'stacks-queues' },
    ],
  },
  {
    id: 'hashing',
    title: 'Hashing',
    description: 'Learn about key-value mapping and collision resolution.',
    algorithms: [
      { id: 'hash-table', category: 'hashing' },
    ],
  },
  {
    id: 'trees',
    title: 'Trees',
    description: 'Explore hierarchical data structures and traversals.',
    algorithms: [
      { id: 'binary-tree', category: 'trees' },
      { id: 'bst', category: 'trees' },
      { id: 'avl-tree', category: 'trees' },
      { id: 'red-black-tree', category: 'trees' },
      { id: 'b-tree', category: 'trees' },
      { id: 'b-plus-tree', category: 'trees' },
      { id: 'segment-tree', category: 'trees' },
      { id: 'fenwick-tree', category: 'trees' },
      { id: 'trie', category: 'trees' },
      { id: 'n-ary-tree', category: 'trees' },
      { id: 'inorder', category: 'trees' },
      { id: 'preorder', category: 'trees' },
      { id: 'postorder', category: 'trees' },
    ],
  },
  {
    id: 'heaps',
    title: 'Heaps',
    description: 'Understand priority-based data structures.',
    algorithms: [
      { id: 'min-heap', category: 'heaps' },
      { id: 'max-heap', category: 'heaps' },
    ],
  },
  {
    id: 'graphs',
    title: 'Graphs',
    description: 'Understand complex relationships and pathfinding.',
    algorithms: [
      { id: 'bfs', category: 'graphs' },
      { id: 'dfs', category: 'graphs' },
      { id: 'dijkstra', category: 'graphs' },
    ],
  },
  {
    id: 'dp',
    title: 'Dynamic Programming',
    description: 'Solve complex problems by breaking them into simpler subproblems.',
    algorithms: [
      { id: 'fibonacci-dp', category: 'dynamic-programming' },
    ],
  },
  {
    id: 'backtracking',
    title: 'Backtracking',
    description: 'Systematically search for solutions to combinatorial problems.',
    algorithms: [
      { id: 'n-queens', category: 'backtracking' },
    ],
  },
];

export const ALGORITHM_DATA: Record<string, AlgorithmInfo> = {
  'bubble-sort': {
    title: 'Bubble Sort',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stability: 'Yes',
    inPlace: 'Yes',
    adaptive: 'Yes',
    pseudocode: `procedure bubbleSort(A : list of sortable items)
    n := length(A)
    repeat
        swapped := false
        for i := 1 to n-1 inclusive do
            if A[i-1] > A[i] then
                swap(A[i-1], A[i])
                swapped := true
            end if
        end for
        n := n - 1
    until not swapped
end procedure`,
    industryUse: 'Rarely used in production due to O(n²) complexity. Primarily used for educational purposes or on very small, nearly sorted datasets where its simplicity is an advantage.',
    detailedExplanation: `### How it Works
Bubble Sort works by repeatedly swapping adjacent elements if they are in the wrong order. This process "bubbles" the largest unsorted element to its correct position at the end of the array in each pass.

### Key Characteristics
- **Stable**: It preserves the relative order of equal elements.
- **In-place**: It requires only a constant amount of extra space.
- **Adaptive**: With an optimization (checking for swaps), it can perform in O(n) time for already sorted arrays.

### Step-by-Step Breakdown
1. Start at the beginning of the array.
2. Compare the first two elements. If the first is greater than the second, swap them.
3. Move to the next pair and repeat until the end of the array is reached.
4. After the first pass, the largest element is guaranteed to be at the last position.
5. Repeat the process for the remaining $n-1$ elements, then $n-2$, and so on.
`,
    difficulty: 'Easy',
    externalLinks: [
      { title: 'GeeksforGeeks - Bubble Sort', url: 'https://www.geeksforgeeks.org/bubble-sort/' },
      { title: 'Wikipedia - Bubble Sort', url: 'https://en.wikipedia.org/wiki/Bubble_sort' },
      { title: 'Visualgo - Sorting', url: 'https://visualgo.net/en/sorting' }
    ],
    practiceQuestions: [
      {
        title: "Bubble Sort - LeetCode",
        description: "Sort an array using the bubble sort principle.",
        solutionLink: "https://leetcode.com/problems/sort-an-array/"
      },
      {
        title: "Optimize Bubble Sort",
        description: "Implementation of Bubble Sort with a flag to stop early if the array is already sorted.",
        solutionLink: "https://www.geeksforgeeks.org/bubble-sort/"
      }
    ],
    optimizedCode: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
    javaCode: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }
}`,
    pythonCode: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
    cppCode: `#include <vector>
#include <algorithm>

void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    csharpCode: `public class BubbleSort {
    public static void Sort(int[] arr) {
        int n = arr.Length;
        for (int i = 0; i < n; i++) {
            bool swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }
}`,
    quiz: [
      {
        question: "What is the worst-case time complexity of Bubble Sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
        correctAnswer: 2,
        explanation: "In the worst case (reverse sorted array), Bubble Sort needs to perform n-1 passes, each with up to n-1 comparisons, resulting in O(n²) complexity."
      },
      {
        question: "Is Bubble Sort a stable sorting algorithm?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Yes, Bubble Sort is stable because it only swaps adjacent elements if they are strictly in the wrong order, preserving the relative order of equal elements."
      },
      {
        question: "What is the best-case time complexity of optimized Bubble Sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
        correctAnswer: 0,
        explanation: "If the array is already sorted, the optimized version of Bubble Sort can detect this in a single pass, resulting in O(n) time complexity."
      },
      {
        question: "What is the space complexity of Bubble Sort?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Bubble Sort is an in-place algorithm, meaning it only requires a constant amount of extra space (O(1)) regardless of the input size."
      },
      {
        question: "Which operation is fundamental to Bubble Sort?",
        options: ["Partitioning", "Merging", "Swapping adjacent elements", "Finding the minimum"],
        correctAnswer: 2,
        explanation: "Bubble Sort works by repeatedly comparing and swapping adjacent elements if they are in the wrong order."
      },
      {
        question: "How many passes are required in the worst case for Bubble Sort of n elements?",
        options: ["n", "n-1", "log n", "n/2"],
        correctAnswer: 1,
        explanation: "In the worst case, Bubble Sort requires n-1 passes to ensure all elements are correctly positioned."
      },
      {
        question: "Is Bubble Sort considered efficient for large datasets?",
        options: ["Yes", "No"],
        correctAnswer: 1,
        explanation: "No, its O(n²) time complexity makes it very slow for large datasets compared to algorithms like Quick Sort or Merge Sort."
      },
      {
        question: "What is guaranteed after the first pass of Bubble Sort?",
        options: ["The array is sorted", "The smallest element is at the beginning", "The largest element is at the end", "The middle element is in place"],
        correctAnswer: 2,
        explanation: "After the first pass, the largest element 'bubbles up' to its final correct position at the end of the array."
      },
      {
        question: "Bubble Sort is an example of which algorithmic paradigm?",
        options: ["Divide and Conquer", "Greedy", "Brute Force / Comparison-based", "Dynamic Programming"],
        correctAnswer: 2,
        explanation: "Bubble Sort is a simple comparison-based sorting algorithm that uses a brute-force approach to arrange elements."
      },
      {
        question: "When is Bubble Sort adaptive?",
        options: ["Always", "Never", "When optimized with a swapped flag", "Only for small arrays"],
        correctAnswer: 2,
        explanation: "Bubble Sort becomes adaptive when a flag is used to detect if any swaps occurred during a pass; if no swaps occur, the algorithm terminates early."
      }
    ]
  },
  'selection-sort': {
    title: 'Selection Sort',
    description: 'An in-place comparison sorting algorithm that divides the input list into two parts: a sorted sublist and an unsorted sublist.',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stability: 'No',
    inPlace: 'Yes',
    adaptive: 'No',
    pseudocode: `procedure selectionSort(A : list of sortable items)
    n := length(A)
    for i := 0 to n-1 do
        min_idx := i
        for j := i+1 to n-1 do
            if A[j] < A[min_idx] then
                min_idx := j
            end if
        end for
        swap(A[i], A[min_idx])
    end for
end procedure`,
    industryUse: 'Used when memory is extremely limited as it performs the minimum number of swaps (O(n)). Useful in embedded systems where write operations are expensive.',
    detailedExplanation: `### How it Works
Selection Sort works by repeatedly finding the minimum element from the unsorted part of the array and putting it at the beginning. The algorithm maintains two sub-arrays: one which is already sorted and another which is unsorted.

### Key Characteristics
- **In-place**: It requires only a constant amount of extra space.
- **Minimum Swaps**: It performs at most $n-1$ swaps, which is the minimum possible for any comparison-based sort.
- **Not Stable**: It does not necessarily preserve the relative order of equal elements.

### Step-by-Step Breakdown
1. Find the smallest element in the unsorted part of the array.
2. Swap it with the first element of the unsorted part.
3. Move the boundary between the sorted and unsorted parts one element to the right.
4. Repeat until the entire array is sorted.
`,
    difficulty: 'Easy',
    optimizedCode: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`,
    javaCode: `public class SelectionSort {
    public static void selectionSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) minIdx = j;
            }
            int temp = arr[minIdx];
            arr[minIdx] = arr[i];
            arr[i] = temp;
        }
    }
}`,
    pythonCode: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    cppCode: `#include <vector>
#include <algorithm>

void selectionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) min_idx = j;
        }
        std::swap(arr[i], arr[min_idx]);
    }
}`,
    csharpCode: `public class SelectionSort {
    public static void Sort(int[] arr) {
        int n = arr.Length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) minIdx = j;
            }
            int temp = arr[minIdx];
            arr[minIdx] = arr[i];
            arr[i] = temp;
        }
    }
}`,
    quiz: [
      {
        question: "What is the primary advantage of Selection Sort?",
        options: ["Fastest average time", "Minimum number of swaps", "Stable sorting", "O(n) worst case"],
        correctAnswer: 1,
        explanation: "Selection Sort performs O(n) swaps in the worst case, which is the minimum possible for any comparison-based sort. This is useful when write operations are expensive."
      },
      {
        question: "Does Selection Sort's performance depend on the initial order of elements?",
        options: ["Yes, it's faster if sorted", "No, it always takes O(n²)", "Yes, it's slower if reverse sorted"],
        correctAnswer: 1,
        explanation: "Selection Sort always performs the same number of comparisons regardless of the initial order, resulting in O(n²) complexity for all cases."
      },
      {
        question: "What is the best-case time complexity of Selection Sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
        correctAnswer: 2,
        explanation: "Even if the array is already sorted, Selection Sort still performs the same number of comparisons to find the minimum, resulting in O(n²) time."
      },
      {
        question: "What is the space complexity of Selection Sort?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Selection Sort is an in-place algorithm and requires only O(1) extra space."
      },
      {
        question: "How many swaps does Selection Sort perform in the worst case?",
        options: ["O(n²)", "O(n)", "O(log n)", "O(1)"],
        correctAnswer: 1,
        explanation: "Selection Sort performs at most n-1 swaps, which is O(n). This is one of its primary advantages over Bubble Sort."
      },
      {
        question: "What is the basic operation of Selection Sort?",
        options: ["Merging sub-arrays", "Partitioning around a pivot", "Finding the minimum element in the unsorted part", "Swapping adjacent elements"],
        correctAnswer: 2,
        explanation: "Selection Sort works by repeatedly finding the minimum element from the unsorted part and moving it to the sorted part."
      },
      {
        question: "Is Selection Sort adaptive?",
        options: ["Yes", "No"],
        correctAnswer: 1,
        explanation: "No, Selection Sort is not adaptive because it does not change its behavior based on the initial order of the input."
      },
      {
        question: "What is guaranteed after the first pass of Selection Sort?",
        options: ["The array is sorted", "The smallest element is at the beginning", "The largest element is at the end", "The middle element is in place"],
        correctAnswer: 1,
        explanation: "After the first pass, the smallest element is found and swapped to the first position."
      },
      {
        question: "In which scenario is Selection Sort particularly useful?",
        options: ["Large datasets", "Already sorted arrays", "Systems where write operations are expensive", "Recursive implementations"],
        correctAnswer: 2,
        explanation: "Because Selection Sort minimizes the number of swaps (O(n)), it is useful in systems where writing to memory is much more expensive than reading."
      },
      {
        question: "Selection Sort divides the array into which two parts?",
        options: ["Left and Right", "Sorted and Unsorted sublists", "Even and Odd indices", "Positive and Negative numbers"],
        correctAnswer: 1,
        explanation: "Selection Sort maintains a sorted sublist at the beginning and an unsorted sublist for the remainder of the array."
      }
    ],
    practiceQuestions: [
      {
        title: "Find the Minimum Element in an Array",
        description: "Implement a function to find the minimum element in an array, which is the core logic of Selection Sort.",
        solutionLink: "https://www.geeksforgeeks.org/find-minimum-and-maximum-element-in-an-array/"
      }
    ],
    externalLinks: [
      { title: 'GeeksforGeeks - Selection Sort', url: 'https://www.geeksforgeeks.org/selection-sort/' },
      { title: 'Wikipedia - Selection Sort', url: 'https://en.wikipedia.org/wiki/Selection_sort' },
      { title: "Selection Sort - Programiz", url: "https://www.programiz.com/dsa/selection-sort" }
    ]
  },
  'insertion-sort': {
    title: 'Insertion Sort',
    description: 'Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stability: 'Yes',
    inPlace: 'Yes',
    adaptive: 'Yes',
    pseudocode: `procedure insertionSort(A : list of sortable items)
    for i := 1 to length(A) - 1 do
        key := A[i]
        j := i - 1
        while j >= 0 and A[j] > key do
            A[j + 1] := A[j]
            j := j - 1
        end while
        A[j + 1] := key
    end for
end procedure`,
    industryUse: 'Used as the base case for hybrid sorting algorithms like Timsort (used in Python and Java) for small sub-arrays (typically < 64 elements).',
    detailedExplanation: `### How it Works
Insertion Sort works similarly to the way you sort playing cards in your hands. The array is virtually split into a sorted and an unsorted part. Values from the unsorted part are picked and placed at the correct position in the sorted part.

### Key Characteristics
- **Stable**: It preserves the relative order of equal elements.
- **In-place**: It requires only a constant amount of extra space.
- **Online**: It can sort a list as it receives it.
- **Efficient for Small Data**: It is very fast for small datasets and nearly sorted arrays.

### Step-by-Step Breakdown
1. Assume the first element is already sorted.
2. Pick the next element and compare it with the elements in the sorted part (from right to left).
3. Shift all elements in the sorted part that are greater than the picked element to the right.
4. Insert the picked element into its correct position.
5. Repeat until the entire array is sorted.
`,
    difficulty: 'Easy',
    optimizedCode: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    javaCode: `public class InsertionSort {
    public static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
}`,
    pythonCode: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
    cppCode: `#include <vector>

void insertionSort(std::vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    csharpCode: `public class InsertionSort {
    public static void Sort(int[] arr) {
        for (int i = 1; i < arr.Length; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
}`,
    quiz: [
      {
        question: "What is the best-case time complexity of Insertion Sort?",
        options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
        correctAnswer: 2,
        explanation: "If the array is already sorted, Insertion Sort only makes one comparison per element and no swaps, resulting in O(n) time complexity."
      },
      {
        question: "In which scenario is Insertion Sort highly efficient?",
        options: ["Large random arrays", "Small or nearly sorted arrays", "Reverse sorted arrays", "Linked lists only"],
        correctAnswer: 1,
        explanation: "Insertion Sort is very fast for small datasets and nearly sorted arrays, which is why it's used in hybrid algorithms like Timsort."
      },
      {
        question: "Is Insertion Sort a stable sorting algorithm?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Yes, Insertion Sort is stable as it does not change the relative order of elements with equal keys."
      },
      {
        question: "What is the space complexity of Insertion Sort?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Insertion Sort is an in-place algorithm, requiring only O(1) extra space."
      },
      {
        question: "Insertion Sort is an 'online' algorithm. What does this mean?",
        options: ["It requires an internet connection", "It can sort a list as it receives it", "It only works on cloud data", "It is always active"],
        correctAnswer: 1,
        explanation: "An online algorithm can process its input piece by piece in a serial fashion, without having the entire input available from the start."
      },
      {
        question: "What is the basic operation of Insertion Sort?",
        options: ["Swapping adjacent elements", "Finding the minimum", "Inserting an element into its correct position in a sorted sub-array", "Merging sub-arrays"],
        correctAnswer: 2,
        explanation: "Insertion Sort works by taking one element at a time and inserting it into its correct position within the already sorted part of the array."
      },
      {
        question: "Which hybrid sorting algorithm uses Insertion Sort for small sub-arrays?",
        options: ["Quick Sort", "Merge Sort", "Timsort", "Heap Sort"],
        correctAnswer: 2,
        explanation: "Timsort, used in Python and Java, uses Insertion Sort for small sub-arrays (runs) because it is very efficient for small datasets."
      },
      {
        question: "What is the worst-case time complexity of Insertion Sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
        correctAnswer: 2,
        explanation: "In the worst case (reverse sorted array), Insertion Sort performs O(n²) comparisons and shifts."
      },
      {
        question: "How does Insertion Sort compare to Bubble Sort on nearly sorted data?",
        options: ["Bubble Sort is faster", "Insertion Sort is generally faster", "They are identical", "Both are O(n log n)"],
        correctAnswer: 1,
        explanation: "While both can be O(n) in the best case, Insertion Sort typically performs fewer operations than Bubble Sort on nearly sorted data."
      },
      {
        question: "Insertion Sort is most similar to which real-world activity?",
        options: ["Organizing a library", "Sorting a deck of cards in hand", "Queueing at a store", "Dividing a cake"],
        correctAnswer: 1,
        explanation: "Insertion Sort is often compared to how people sort playing cards in their hands, picking one card at a time and inserting it into the correct spot."
      }
    ],
    practiceQuestions: [
      {
        title: "Sort a Linked List using Insertion Sort",
        description: "Given the head of a singly linked list, sort the list using insertion sort.",
        solutionLink: "https://leetcode.com/problems/insertion-sort-list/"
      }
    ],
    externalLinks: [
      { title: 'GeeksforGeeks - Insertion Sort', url: 'https://www.geeksforgeeks.org/insertion-sort/' },
      { title: 'Wikipedia - Insertion Sort', url: 'https://en.wikipedia.org/wiki/Insertion_sort' },
      { title: "Insertion Sort - Khan Academy", url: "https://www.khanacademy.org/computing/computer-science/algorithms/insertion-sort/a/insertion-sort" }
    ]
  },
  'merge-sort': {
    title: 'Merge Sort',
    description: 'An efficient, stable, comparison-based, divide and conquer sorting algorithm. It works by recursively dividing the array into halves, sorting them, and then merging the sorted halves.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    stability: 'Yes',
    inPlace: 'No',
    adaptive: 'No',
    pseudocode: `procedure mergeSort(A : list)
    if length(A) <= 1 return A
    mid := length(A) / 2
    left := mergeSort(A[0...mid])
    right := mergeSort(A[mid...end])
    return merge(left, right)
end procedure`,
    industryUse: 'Highly used in external sorting (sorting data that doesn\'t fit in RAM) and for sorting linked lists. It is the basis for Timsort.',
    detailedExplanation: `### How it Works
Merge Sort is a **Divide and Conquer** algorithm. It works by recursively dividing the input array into two halves, sorting each half, and then merging the sorted halves back together.

### Key Characteristics
- **Stable**: It preserves the relative order of equal elements.
- **Predictable**: Its time complexity is always $O(n \log n)$, regardless of the initial order of elements.
- **Not In-place**: It requires $O(n)$ extra space for the merging process.

### Step-by-Step Breakdown
1. **Divide**: If the array has more than one element, split it into two halves.
2. **Conquer**: Recursively call Merge Sort on both halves.
3. **Combine**: Merge the two sorted halves into a single sorted array.
   - Compare the first elements of both halves.
   - Pick the smaller one and add it to the result array.
   - Repeat until all elements from both halves are merged.
`,
    difficulty: 'Medium',
    optimizedCode: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  let result = [], i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
    javaCode: `import java.util.Arrays;

public class MergeSort {
    public static void mergeSort(int[] arr) {
        if (arr.length <= 1) return;
        int mid = arr.length / 2;
        int[] left = Arrays.copyOfRange(arr, 0, mid);
        int[] right = Arrays.copyOfRange(arr, mid, arr.length);
        mergeSort(left);
        mergeSort(right);
        merge(arr, left, right);
    }

    private static void merge(int[] arr, int[] left, int[] right) {
        int i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) arr[k++] = left[i++];
            else arr[k++] = right[j++];
        }
        while (i < left.length) arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
    }
}`,
    pythonCode: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
    cppCode: `#include <vector>

void merge(std::vector<int>& arr, int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    std::vector<int> L(n1), R(n2);
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(std::vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}`,
    csharpCode: `public class MergeSort {
    public static void Sort(int[] arr, int l, int r) {
        if (l < r) {
            int m = l + (r - l) / 2;
            Sort(arr, l, m);
            Sort(arr, m + 1, r);
            Merge(arr, l, m, r);
        }
    }

    private static void Merge(int[] arr, int l, int m, int r) {
        int n1 = m - l + 1;
        int n2 = r - m;
        int[] L = new int[n1];
        int[] R = new int[n2];
        for (int i = 0; i < n1; ++i) L[i] = arr[l + i];
        for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];
        int i1 = 0, i2 = 0, k = l;
        while (i1 < n1 && i2 < n2) {
            if (L[i1] <= R[i2]) arr[k++] = L[i1++];
            else arr[k++] = R[i2++];
        }
        while (i1 < n1) arr[k++] = L[i1++];
        while (i2 < n2) arr[k++] = R[i2++];
    }
}`,
    quiz: [
      {
        question: "What is the worst-case time complexity of Merge Sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
        correctAnswer: 1,
        explanation: "Merge Sort consistently performs O(n log n) operations regardless of the input data distribution."
      },
      {
        question: "Is Merge Sort a stable sorting algorithm?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Yes, Merge Sort is stable because it preserves the relative order of equal elements during the merge process."
      },
      {
        question: "What is the space complexity of Merge Sort?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 2,
        explanation: "Merge Sort requires O(n) extra space to store the temporary sub-arrays during the merging process."
      },
      {
        question: "Which algorithmic paradigm does Merge Sort follow?",
        options: ["Greedy", "Dynamic Programming", "Divide and Conquer", "Backtracking"],
        correctAnswer: 2,
        explanation: "Merge Sort follows the Divide and Conquer paradigm: it divides the problem into subproblems, solves them recursively, and combines the results."
      },
      {
        question: "What is the best-case time complexity of Merge Sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
        correctAnswer: 1,
        explanation: "Merge Sort always takes O(n log n) time because it always divides the array into halves and merges them, regardless of the initial order."
      },
      {
        question: "Merge Sort is particularly efficient for which type of data structure?",
        options: ["Arrays only", "Linked Lists", "Hash Tables", "Stacks"],
        correctAnswer: 1,
        explanation: "Merge Sort is very efficient for linked lists because it can be implemented without the O(n) extra space required for arrays."
      },
      {
        question: "What is the 'Merge' step in Merge Sort?",
        options: ["Splitting the array", "Comparing and combining two sorted sub-arrays", "Finding the pivot", "Swapping adjacent elements"],
        correctAnswer: 1,
        explanation: "The merge step is where two sorted sub-arrays are combined into a single sorted array by comparing their elements."
      },
      {
        question: "Is Merge Sort an in-place sorting algorithm?",
        options: ["Yes", "No"],
        correctAnswer: 1,
        explanation: "Standard Merge Sort is not in-place as it requires O(n) auxiliary space for merging."
      },
      {
        question: "Which sorting algorithm is often used for 'External Sorting'?",
        options: ["Quick Sort", "Merge Sort", "Bubble Sort", "Insertion Sort"],
        correctAnswer: 1,
        explanation: "Merge Sort is ideal for external sorting (sorting data that doesn't fit in memory) because it processes data in chunks and merges them."
      },
      {
        question: "How many recursive calls are made in each step of Merge Sort?",
        options: ["1", "2", "log n", "n"],
        correctAnswer: 1,
        explanation: "In each step, Merge Sort recursively calls itself twice: once for the left half and once for the right half."
      }
    ],
    practiceQuestions: [
      {
        title: "Merge Two Sorted Lists",
        description: "Merge two sorted linked lists and return it as a sorted list.",
        solutionLink: "https://leetcode.com/problems/merge-two-sorted-lists/"
      },
      {
        title: "Count Inversions in an Array",
        description: "Count the number of inversions in an array using the Merge Sort technique.",
        solutionLink: "https://www.geeksforgeeks.org/inversion-count-in-an-array-using-merge-sort/"
      }
    ],
    externalLinks: [
      {
        title: "Merge Sort - GeeksforGeeks",
        url: "https://www.geeksforgeeks.org/merge-sort/"
      }
    ]
  },
  'quick-sort': {
    title: 'Quick Sort',
    description: 'An efficient, comparison-based, divide and conquer sorting algorithm. It works by selecting a "pivot" element and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    stability: 'No',
    inPlace: 'Yes',
    adaptive: 'No',
    pseudocode: `procedure quickSort(A, low, high)
    if low < high then
        p := partition(A, low, high)
        quickSort(A, low, p - 1)
        quickSort(A, p + 1, high)
    end if
end procedure`,
    industryUse: 'Often the fastest general-purpose sort in practice. Used in many standard libraries (like C++ std::sort) with optimizations like median-of-three pivoting.',
    detailedExplanation: `### How it Works
Quick Sort is a **Divide and Conquer** algorithm. it picks an element as a "pivot" and partitions the given array around the picked pivot. There are many versions of Quick Sort that pick pivot in different ways (first, last, random, or median).

### Key Characteristics
- **In-place**: It requires only $O(\log n)$ extra space (for the recursion stack).
- **Not Stable**: It does not necessarily preserve the relative order of equal elements.
- **Fastest in Practice**: On average, it is faster than Merge Sort and Heap Sort due to better cache locality and lower constant factors.

### Step-by-Step Breakdown
1. **Pick a Pivot**: Choose an element from the array (e.g., the last element).
2. **Partition**: Rearrange the array so that all elements smaller than the pivot are on the left, and all elements larger than the pivot are on the right.
3. **Recurse**: Recursively apply the same logic to the left and right sub-arrays.
`,
    difficulty: 'Medium',
    optimizedCode: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    let pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[high]] = [arr[high], arr[i]];
  return i;
}`,
    javaCode: `public class QuickSort {
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = (low - 1);
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }
}`,
    pythonCode: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`,
    cppCode: `#include <vector>
#include <algorithm>

int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return (i + 1);
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    csharpCode: `public class QuickSort {
    public static void Sort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = Partition(arr, low, high);
            Sort(arr, low, pi - 1);
            Sort(arr, pi + 1, high);
        }
    }

    private static int Partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = (low - 1);
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp1 = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp1;
        return i + 1;
    }
}`,
    quiz: [
      {
        question: "When does Quick Sort perform at its worst (O(n²))?",
        options: ["Randomly distributed elements", "When the pivot is always the smallest or largest element", "When the array is already sorted and we pick the first/last element as pivot", "Both B and C"],
        correctAnswer: 3,
        explanation: "If the pivot consistently partitions the array into highly unbalanced sub-arrays (e.g., 0 and n-1 elements), the recursion depth becomes O(n), leading to O(n²) time."
      },
      {
        question: "What is the average time complexity of Quick Sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctAnswer: 1,
        explanation: "On average, Quick Sort partitions the array into reasonably balanced sub-arrays, leading to a recursion depth of O(log n) and a total time of O(n log n)."
      },
      {
        question: "What is the space complexity of Quick Sort?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 2,
        explanation: "Quick Sort is in-place but requires O(log n) space for the recursion stack in the average case."
      },
      {
        question: "Which algorithmic paradigm does Quick Sort follow?",
        options: ["Greedy", "Divide and Conquer", "Dynamic Programming", "Backtracking"],
        correctAnswer: 1,
        explanation: "Quick Sort is a Divide and Conquer algorithm that partitions the array around a pivot."
      },
      {
        question: "Is Quick Sort a stable sorting algorithm?",
        options: ["Yes", "No"],
        correctAnswer: 1,
        explanation: "Standard Quick Sort is not stable because elements with equal values may be swapped during the partitioning process."
      },
      {
        question: "What is the 'Pivot' in Quick Sort?",
        options: ["The smallest element", "The largest element", "An element used to partition the array", "The middle element only"],
        correctAnswer: 2,
        explanation: "The pivot is an element chosen from the array around which all other elements are partitioned."
      },
      {
        question: "Which pivot selection strategy helps avoid the O(n²) worst case?",
        options: ["Always picking the first element", "Always picking the last element", "Median-of-three or random selection", "Picking the middle element"],
        correctAnswer: 2,
        explanation: "Median-of-three or choosing a random pivot significantly reduces the probability of encountering the worst-case scenario."
      },
      {
        question: "What is the basic operation of Quick Sort?",
        options: ["Merging", "Partitioning", "Swapping adjacent elements", "Finding the minimum"],
        correctAnswer: 1,
        explanation: "Partitioning is the core operation of Quick Sort, where elements are arranged relative to the pivot."
      },
      {
        question: "In practice, how does Quick Sort compare to Merge Sort?",
        options: ["Merge Sort is always faster", "Quick Sort is often faster due to better cache locality", "They are identical in speed", "Quick Sort is only faster for small arrays"],
        correctAnswer: 1,
        explanation: "Quick Sort often outperforms Merge Sort in practice because it is in-place and has better cache performance."
      },
      {
        question: "What is the best-case time complexity of Quick Sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
        correctAnswer: 1,
        explanation: "The best case occurs when the pivot always divides the array into two equal halves, resulting in O(n log n) time."
      }
    ],
    practiceQuestions: [
      {
        title: "Kth Largest Element in an Array",
        description: "Find the kth largest element in an unsorted array using QuickSelect (based on QuickSort).",
        solutionLink: "https://leetcode.com/problems/kth-largest-element-in-an-array/"
      }
    ],
    externalLinks: [
      {
        title: "QuickSort - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Quicksort"
      }
    ]
  },
  'binary-tree': {
    title: 'Binary Tree',
    description: 'A tree data structure in which each node has at most two children, referred to as the left child and the right child.',
    timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    pseudocode: `class Node:
    data, left, right`,
    industryUse: 'Basis for more complex trees like BST, AVL, and Heaps. Used in expression trees and Huffman coding.',
    detailedExplanation: `### How it Works
A Binary Tree is a tree data structure in which each node has at most two children, which are referred to as the left child and the right child. It is a hierarchical structure used to represent data with a parent-child relationship.

### Key Terms
- **Root**: The topmost node of the tree.
- **Leaf**: A node with no children.
- **Parent/Child**: A node is a parent of the nodes it points to.
- **Depth**: The number of edges from the root to a node.
- **Height**: The number of edges on the longest path from a node to a leaf.

### Types of Binary Trees
- **Full Binary Tree**: Every node has either 0 or 2 children.
- **Complete Binary Tree**: All levels are completely filled except possibly the last level, which is filled from left to right.
- **Perfect Binary Tree**: All internal nodes have two children and all leaves are at the same level.
`,
    difficulty: 'Easy',
    optimizedCode: `class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}`,
    quiz: [
      {
        question: "What is the maximum number of children a node in a Binary Tree can have?",
        options: ["1", "2", "3", "Unlimited"],
        correctAnswer: 1,
        explanation: "By definition, each node in a binary tree can have at most two children: a left child and a right child."
      },
      {
        question: "What is the topmost node of a tree called?",
        options: ["Leaf", "Branch", "Root", "Stem"],
        correctAnswer: 2,
        explanation: "The root is the starting node of a tree and has no parent."
      },
      {
        question: "What is a node with no children called?",
        options: ["Root", "Internal Node", "Leaf", "Parent"],
        correctAnswer: 2,
        explanation: "A leaf node is a terminal node in a tree structure that does not have any child nodes."
      },
      {
        question: "In a 'Full Binary Tree', how many children can each node have?",
        options: ["Exactly 2", "0 or 2", "Exactly 1", "At least 1"],
        correctAnswer: 1,
        explanation: "A full binary tree is a tree in which every node has either 0 or 2 children."
      },
      {
        question: "What characterizes a 'Complete Binary Tree'?",
        options: ["All levels are completely filled", "All levels are filled except possibly the last, which is filled from left to right", "Every node has exactly 2 children", "All leaves are at the same level"],
        correctAnswer: 1,
        explanation: "In a complete binary tree, every level is filled except possibly the last, and all nodes in the last level are as far left as possible."
      },
      {
        question: "What is a 'Perfect Binary Tree'?",
        options: ["A tree with no nodes", "A tree where all internal nodes have two children and all leaves are at the same level", "A tree with only one node", "A tree where every node has at least one child"],
        correctAnswer: 1,
        explanation: "A perfect binary tree is both full and complete, with all leaf nodes at the same maximum depth."
      },
      {
        question: "What does 'Depth' of a node represent?",
        options: ["Number of children", "Number of edges from root to the node", "Number of edges to the deepest leaf", "Total number of nodes in the tree"],
        correctAnswer: 1,
        explanation: "Depth is the distance from the root to a specific node."
      },
      {
        question: "What does 'Height' of a node represent?",
        options: ["Number of edges from root to the node", "Number of edges on the longest path from the node to a leaf", "Total number of levels", "Number of siblings"],
        correctAnswer: 1,
        explanation: "Height is the distance from a node to its deepest descendant leaf."
      },
      {
        question: "Which traversal visits nodes in the order: Left, Root, Right?",
        options: ["Preorder", "Inorder", "Postorder", "Level-order"],
        correctAnswer: 1,
        explanation: "Inorder traversal visits the left subtree, then the root, then the right subtree."
      },
      {
        question: "What is the space complexity of storing a Binary Tree with n nodes?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 2,
        explanation: "Storing n nodes requires O(n) space, as each node occupies a constant amount of memory."
      }
    ]
  },
  'bst': {
    title: 'Binary Search Tree (BST)',
    description: 'A binary tree where the left child is smaller than the parent and the right child is larger.',
    timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    pseudocode: `procedure insert(root, val):
    if root is null: return Node(val)
    if val < root.val: root.left := insert(root.left, val)
    else: root.right := insert(root.right, val)
    return root`,
    industryUse: 'Used in many search applications where data is constantly entering and leaving, such as map and set objects in some libraries.',
    detailedExplanation: `### How it Works
A Binary Search Tree (BST) is a binary tree where for each node, all elements in the left subtree are less than the node's value, and all elements in the right subtree are greater than the node's value.

### Key Properties
- **Ordered**: An in-order traversal of a BST yields the elements in sorted order.
- **Efficient Search**: On average, search, insertion, and deletion take $O(\log n)$ time.
- **Worst Case**: If the tree becomes unbalanced (e.g., elements inserted in sorted order), it can degrade to a linked list with $O(n)$ performance.

### Operations
- **Search**: Compare the target with the current node; move left if smaller, right if larger.
- **Insertion**: Similar to search, find the empty spot where the new value belongs.
- **Deletion**: More complex; involves handling three cases: node with no children, one child, or two children.
`,
    difficulty: 'Medium',
    optimizedCode: `class BST {
  constructor() { this.root = null; }
  insert(val) {
    const newNode = new Node(val);
    if (!this.root) { this.root = newNode; return; }
    let curr = this.root;
    while (true) {
      if (val < curr.data) {
        if (!curr.left) { curr.left = newNode; break; }
        curr = curr.left;
      } else {
        if (!curr.right) { curr.right = newNode; break; }
        curr = curr.right;
      }
    }
  }
}`,
    quiz: [
      {
        question: "What is the defining property of a Binary Search Tree (BST)?",
        options: ["Left child > Parent", "Left child < Parent and Right child > Parent", "All nodes have 2 children", "Root is always the largest element"],
        correctAnswer: 1,
        explanation: "In a BST, for any given node, all values in the left subtree are smaller and all values in the right subtree are larger."
      },
      {
        question: "Which traversal of a BST results in sorted order?",
        options: ["Preorder", "Postorder", "Inorder", "Level-order"],
        correctAnswer: 2,
        explanation: "An inorder traversal (Left, Root, Right) of a BST visits nodes in ascending sorted order."
      },
      {
        question: "What is the average time complexity for searching in a BST?",
        options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
        correctAnswer: 2,
        explanation: "On average, a BST is balanced, allowing search operations to skip half the remaining tree at each step, resulting in O(log n) time."
      },
      {
        question: "What is the worst-case time complexity for searching in a BST?",
        options: ["O(log n)", "O(n)", "O(n log n)", "O(1)"],
        correctAnswer: 1,
        explanation: "In the worst case, a BST can become skewed (like a linked list), requiring O(n) time to find an element."
      },
      {
        question: "Which algorithms are used to keep a BST balanced?",
        options: ["Bubble Sort", "AVL and Red-Black Trees", "Dijkstra's Algorithm", "Merge Sort"],
        correctAnswer: 1,
        explanation: "AVL and Red-Black trees are self-balancing BSTs that perform rotations to maintain logarithmic height."
      },
      {
        question: "How many cases are typically handled during BST node deletion?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 2,
        explanation: "Deletion handles three cases: node is a leaf, node has one child, or node has two children."
      },
      {
        question: "What is the best-case height of a BST with n nodes?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "A perfectly balanced BST has a height of O(log n)."
      },
      {
        question: "What is the worst-case height of a BST with n nodes?",
        options: ["O(log n)", "O(n)", "O(n²)", "O(sqrt(n))"],
        correctAnswer: 1,
        explanation: "A completely skewed BST has a height of O(n)."
      },
      {
        question: "In a BST, where is the minimum element located?",
        options: ["The root", "The rightmost leaf", "The leftmost leaf", "Any leaf"],
        correctAnswer: 2,
        explanation: "The minimum element is always the leftmost node in the tree."
      },
      {
        question: "In a BST, where is the maximum element located?",
        options: ["The root", "The rightmost leaf", "The leftmost leaf", "The middle node"],
        correctAnswer: 1,
        explanation: "The maximum element is always the rightmost node in the tree."
      }
    ]
  },
  'avl-tree': {
    title: 'AVL Tree',
    description: 'A self-balancing binary search tree where the heights of the two child subtrees of any node differ by at most one.',
    timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(n)',
    pseudocode: `procedure rotateLeft(y):
    x := y.right
    T2 := x.left
    x.left := y
    y.right := T2
    return x`,
    industryUse: 'Used in databases where lookups are more frequent than insertions/deletions, as it is more strictly balanced than Red-Black trees.',
    detailedExplanation: `### How it Works
An AVL Tree (named after inventors Adelson-Velsky and Landis) is a self-balancing Binary Search Tree. In an AVL tree, the heights of the two child subtrees of any node differ by at most one. If at any time they differ by more than one, rebalancing is performed to restore this property.

### Balance Factor
The balance factor of a node is defined as:
$BalanceFactor = Height(LeftSubtree) - Height(RightSubtree)$
In an AVL tree, the balance factor of every node must be -1, 0, or 1.

### Rotations
When the balance property is violated, one of four types of rotations is performed:
1. **Left Rotation (LL)**: Used when a node is inserted into the right subtree of a right child.
2. **Right Rotation (RR)**: Used when a node is inserted into the left subtree of a left child.
3. **Left-Right Rotation (LR)**: A combination of a left and then a right rotation.
4. **Right-Left Rotation (RL)**: A combination of a right and then a left rotation.
`,
    difficulty: 'Hard',
    optimizedCode: `// AVL Tree implementation with rotations...`,
    quiz: [
      {
        question: "What is the defining characteristic of an AVL Tree?",
        options: ["It is a Red-Black tree", "The heights of two child subtrees of any node differ by at most one", "It is always a perfect binary tree", "It only allows 100 nodes"],
        correctAnswer: 1,
        explanation: "An AVL tree is a self-balancing BST where the height difference (balance factor) between left and right subtrees is at most 1."
      },
      {
        question: "What is the valid range for the Balance Factor in an AVL tree?",
        options: ["0 to 2", "-1, 0, 1", "-2 to 2", "Any positive integer"],
        correctAnswer: 1,
        explanation: "The balance factor must be -1, 0, or 1 for every node in an AVL tree."
      },
      {
        question: "How is the Balance Factor calculated?",
        options: ["Left Height + Right Height", "Left Height - Right Height", "Root - Leaf", "Number of children"],
        correctAnswer: 1,
        explanation: "Balance Factor = Height(Left Subtree) - Height(Right Subtree)."
      },
      {
        question: "What is the worst-case time complexity for search, insert, and delete in an AVL tree?",
        options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
        correctAnswer: 2,
        explanation: "Because it is strictly balanced, all basic operations are guaranteed to be O(log n)."
      },
      {
        question: "What operation is used to restore balance in an AVL tree?",
        options: ["Swapping", "Merging", "Rotations", "Partitioning"],
        correctAnswer: 2,
        explanation: "AVL trees use single and double rotations to restore the balance property after insertions or deletions."
      },
      {
        question: "How many basic types of rotations exist in AVL trees?",
        options: ["1", "2", "4", "8"],
        correctAnswer: 2,
        explanation: "There are 4 types: Left-Left (LL), Right-Right (RR), Left-Right (LR), and Right-Left (RL)."
      },
      {
        question: "Is an AVL tree more strictly balanced than a Red-Black tree?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Yes, AVL trees are more strictly balanced, which makes lookups faster but insertions/deletions potentially slower due to more rotations."
      },
      {
        question: "Who are the inventors of the AVL tree?",
        options: ["Knuth and Dijkstra", "Adelson-Velsky and Landis", "Hoare and Tarjan", "Cormen and Rivest"],
        correctAnswer: 1,
        explanation: "The AVL tree is named after G.M. Adelson-Velsky and E.M. Landis, who published it in 1962."
      },
      {
        question: "When should you prefer an AVL tree over a Red-Black tree?",
        options: ["When insertions are frequent", "When lookups are much more frequent than insertions/deletions", "When memory is limited", "Always"],
        correctAnswer: 1,
        explanation: "AVL trees provide faster lookups because they are more strictly balanced, making them ideal for read-heavy workloads."
      },
      {
        question: "What is the maximum height of an AVL tree with n nodes?",
        options: ["~1.44 log n", "~2 log n", "n", "log n"],
        correctAnswer: 0,
        explanation: "The height of an AVL tree is strictly logarithmic, approximately 1.44 * log2(n)."
      }
    ]
  },
  'red-black-tree': {
    title: 'Red-Black Tree',
    description: 'A self-balancing binary search tree where each node has an extra bit for denoting the color (red or black), used to ensure the tree remains approximately balanced.',
    timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(n)',
    pseudocode: `// Red-Black Tree balancing rules...`,
    industryUse: 'Used in Java\'s TreeMap and TreeSet, and C++\'s std::map and std::set.',
    detailedExplanation: `### How it Works
A Red-Black Tree is a self-balancing Binary Search Tree where each node has an extra bit for denoting the color, either red or black. These colors are used to ensure that the tree remains approximately balanced during insertions and deletions.

### Red-Black Properties
1. Every node is either red or black.
2. The root is always black.
3. Every leaf (NIL) is black.
4. If a node is red, then both its children are black (no two red nodes can be adjacent).
5. For each node, all simple paths from the node to descendant leaves contain the same number of black nodes.

### Why Red-Black?
While AVL trees are more strictly balanced (providing faster lookups), Red-Black trees are generally faster for insertions and deletions because they require fewer rotations to maintain their properties. This makes them ideal for general-purpose libraries.
`,
    difficulty: 'Hard',
    optimizedCode: `// Red-Black Tree implementation...`,
    quiz: [
      {
        question: "What color is the root of a Red-Black Tree?",
        options: ["Red", "Black", "Either", "Green"],
        correctAnswer: 1,
        explanation: "Property 2 of Red-Black Trees states that the root is always black."
      },
      {
        question: "Can two red nodes be adjacent in a Red-Black Tree?",
        options: ["Yes", "No"],
        correctAnswer: 1,
        explanation: "Property 4 states that if a node is red, then both its children must be black."
      },
      {
        question: "What is the 'Black Height' property?",
        options: ["Total number of nodes", "Number of black nodes on any path from root to leaf is the same", "Number of red nodes", "Height of the tree"],
        correctAnswer: 1,
        explanation: "Every path from a node to its descendant leaves must contain the same number of black nodes."
      },
      {
        question: "What is the maximum height of a Red-Black Tree with n nodes?",
        options: ["O(n)", "O(log n)", "2 * log(n + 1)", "Both B and C"],
        correctAnswer: 3,
        explanation: "Red-Black trees guarantee O(log n) height, specifically no more than 2 * log(n + 1)."
      },
      {
        question: "Where are Red-Black Trees commonly used in industry?",
        options: ["Java TreeMap/TreeSet", "C++ std::map/set", "Linux kernel scheduler", "All of the above"],
        correctAnswer: 3,
        explanation: "Red-Black trees are widely used in standard libraries and system kernels due to their balanced performance."
      },
      {
        question: "What is the time complexity for insertion in a Red-Black Tree?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "Insertion takes O(log n) time as it involves a search followed by a constant number of rotations and recoloring."
      },
      {
        question: "What is the time complexity for deletion in a Red-Black Tree?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "Deletion takes O(log n) time, maintaining the tree's properties through rotations and recoloring."
      },
      {
        question: "How many colors are used in a Red-Black Tree?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 1,
        explanation: "As the name suggests, nodes are colored either Red or Black."
      },
      {
        question: "What color are the leaf (NIL) nodes in a Red-Black Tree?",
        options: ["Red", "Black", "Transparent", "White"],
        correctAnswer: 1,
        explanation: "Property 3 states that every leaf (NIL) is black."
      },
      {
        question: "How does the number of rotations in Red-Black trees compare to AVL trees?",
        options: ["Red-Black has more", "AVL has more", "They are the same", "Red-Black has zero"],
        correctAnswer: 1,
        explanation: "Red-Black trees generally require fewer rotations than AVL trees to maintain balance, making them faster for updates."
      }
    ]
  },
  'b-tree': {
    title: 'B Tree',
    description: 'A self-balancing tree data structure that maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic time. It is optimized for systems that read and write large blocks of data.',
    timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(n)',
    pseudocode: `// B-Tree search and split logic...`,
    industryUse: 'Widely used in databases and file systems (e.g., NTFS, HFS+).',
    detailedExplanation: `### How it Works
A B-Tree is a self-balancing tree data structure that maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic time. Unlike binary trees, B-trees are optimized for systems that read and write large blocks of data, such as databases and file systems.

### Key Characteristics
- **Multi-way Tree**: Each node can have more than two children (up to $M$ children, where $M$ is the order of the tree).
- **Balanced**: All leaf nodes are at the same depth.
- **Node Capacity**: Each node (except the root) must be at least half-full.
- **Sorted Keys**: Keys within a node are kept in ascending order.

### Why B-Trees?
B-trees are designed to minimize disk I/O operations. By having many children per node, the height of the tree is kept very small, meaning fewer nodes need to be read from disk to find a specific key.
`,
    difficulty: 'Hard',
    optimizedCode: `// B-Tree implementation...`,
    quiz: [
      {
        question: "What is the primary optimization goal of a B-Tree?",
        options: ["Minimize CPU cycles", "Minimize disk I/O operations", "Minimize memory usage", "Maximize recursion depth"],
        correctAnswer: 1,
        explanation: "B-Trees are designed to keep the tree height low, minimizing the number of disk blocks that need to be read."
      },
      {
        question: "In a B-Tree of order M, what is the maximum number of children a node can have?",
        options: ["2", "M", "M-1", "log M"],
        correctAnswer: 1,
        explanation: "The order M defines the maximum number of children any node can have."
      },
      {
        question: "Are all leaf nodes in a B-Tree at the same depth?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Yes, B-Trees are perfectly balanced, meaning all leaves are at the same level."
      },
      {
        question: "What is the minimum number of keys a non-root node in a B-Tree of order M must have?",
        options: ["1", "ceil(M/2) - 1", "M/2", "2"],
        correctAnswer: 1,
        explanation: "To maintain balance, every node (except the root) must be at least half-full."
      },
      {
        question: "What is the time complexity for searching in a B-Tree?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "Search operations follow a path from root to leaf, taking O(log n) time."
      },
      {
        question: "How are keys stored within a B-Tree node?",
        options: ["Randomly", "In descending order", "In ascending sorted order", "In a heap"],
        correctAnswer: 2,
        explanation: "Keys within each node are kept sorted to allow binary search within the node."
      },
      {
        question: "Is a B-Tree a binary tree?",
        options: ["Yes", "No"],
        correctAnswer: 1,
        explanation: "No, it is a multi-way search tree where nodes can have more than two children."
      },
      {
        question: "What is the minimum number of children the root of a B-Tree can have (if it's not a leaf)?",
        options: ["1", "2", "M/2", "M"],
        correctAnswer: 1,
        explanation: "The root must have at least two children if it is not a leaf node."
      },
      {
        question: "What happens when a node in a B-Tree exceeds its maximum capacity?",
        options: ["It is deleted", "It is split into two nodes", "The tree is rebuilt", "It overflows into a linked list"],
        correctAnswer: 1,
        explanation: "When a node becomes too full, it is split, and the median key is promoted to the parent."
      },
      {
        question: "Where are B-Trees commonly used?",
        options: ["In-memory caches", "File systems and databases", "Compilers", "Network protocols"],
        correctAnswer: 1,
        explanation: "B-Trees are the standard for disk-based storage like NTFS and various database engines."
      }
    ]
  },
  'b-plus-tree': {
    title: 'B+ Tree',
    description: 'An N-ary tree with a variable but often large number of children per node. All values are stored in the leaf nodes, and leaf nodes are linked together.',
    timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(n)',
    pseudocode: `// B+ Tree leaf linking and range search...`,
    industryUse: 'The standard index structure for most relational databases (MySQL, PostgreSQL).',
    detailedExplanation: `### How it Works
A B+ Tree is an N-ary tree with a variable but often large number of children per node. It is a variation of the B-tree, with the key difference being that all actual data values are stored in the leaf nodes, while internal nodes only store keys for routing.

### Key Differences from B-Trees
- **Data in Leaves**: All values are stored in the leaf nodes. Internal nodes only contain keys to guide the search.
- **Linked Leaves**: Leaf nodes are linked together in a linked list, allowing for very efficient range queries and sequential access.
- **Redundant Keys**: Keys in internal nodes may also appear in leaf nodes.

### Why B+ Trees?
B+ trees are the standard index structure for most relational databases. Their linked leaf nodes make them exceptionally fast for range-based queries (e.g., "Find all records between date X and date Y").
`,
    difficulty: 'Hard',
    optimizedCode: `// B+ Tree implementation...`,
    quiz: [
      {
        question: "Where is the actual data stored in a B+ Tree?",
        options: ["In all nodes", "Only in internal nodes", "Only in leaf nodes", "In the root only"],
        correctAnswer: 2,
        explanation: "In a B+ Tree, internal nodes only store keys for routing; all data records are stored in the leaves."
      },
      {
        question: "What is a major advantage of B+ Trees over B-Trees for range queries?",
        options: ["Smaller nodes", "Leaf nodes are linked together", "Fewer keys", "Faster insertion"],
        correctAnswer: 1,
        explanation: "Leaf nodes in a B+ Tree are connected in a linked list, allowing for efficient sequential scanning."
      },
      {
        question: "Do internal nodes in a B+ Tree contain redundant keys?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Yes, keys in internal nodes also appear in the leaf nodes where the actual data resides."
      },
      {
        question: "Which data structure is the standard for indexing in relational databases?",
        options: ["AVL Tree", "Hash Table", "B+ Tree", "Binary Search Tree"],
        correctAnswer: 2,
        explanation: "B+ Trees are preferred for databases because they handle large data sets and range queries extremely well."
      },
      {
        question: "What is the time complexity of a search in a B+ Tree?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "Search always goes from root to leaf, taking O(log n) time."
      },
      {
        question: "Are all leaf nodes at the same level in a B+ Tree?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Yes, like B-Trees, B+ Trees are perfectly balanced."
      },
      {
        question: "How does the 'fan-out' (number of children) of a B+ Tree compare to a BST?",
        options: ["It is smaller", "It is much larger", "It is the same", "It is always 2"],
        correctAnswer: 1,
        explanation: "B+ Trees have a very high fan-out (often hundreds of children), which keeps the tree very flat."
      },
      {
        question: "What is the space complexity of a B+ Tree?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 2,
        explanation: "Storing n elements requires O(n) space."
      },
      {
        question: "Why are B+ Trees better for sequential access than B-Trees?",
        options: ["They are smaller", "You don't need to traverse back up to internal nodes", "They use less memory", "They are faster to build"],
        correctAnswer: 1,
        explanation: "The linked list of leaves allows you to traverse all data in order without going back up the tree."
      },
      {
        question: "What is the typical size of a B+ Tree node?",
        options: ["1 KB", "Matches the disk block size (e.g., 4KB or 8KB)", "1 MB", "Variable"],
        correctAnswer: 1,
        explanation: "Nodes are sized to match disk blocks to ensure that one read operation fetches an entire node."
      }
    ]
  },
  'segment-tree': {
    title: 'Segment Tree',
    description: 'A tree data structure used for storing information about intervals, or segments. It allows querying which of the stored segments contain a given point.',
    timeComplexity: { best: 'O(log n) (Query)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(n)',
    pseudocode: `procedure build(node, start, end):
    if start == end: tree[node] := A[start]
    else:
        mid := (start + end) / 2
        build(2*node, start, mid)
        build(2*node+1, mid+1, end)
        tree[node] := tree[2*node] + tree[2*node+1]`,
    industryUse: 'Used in computational geometry and for range query problems (e.g., range sum, range minimum).',
    detailedExplanation: `### How it Works
A Segment Tree is a tree data structure used for storing information about intervals, or segments. It allows querying which of the stored segments contain a given point. It is a static structure; once its structure is built, it cannot be modified, although the values of the nodes can be updated.

### Key Features
- **Range Queries**: Efficiently answers queries like "What is the sum of elements from index $L$ to $R$?"
- **Point Updates**: Efficiently updates the value of an element at a specific index.
- **Complexity**: Both range queries and point updates take $O(\log n)$ time.

### Tree Structure
- Each leaf node represents a single element of the array.
- Each internal node represents the "merge" (e.g., sum, min, max) of its children's intervals.
- For an array of size $n$, the tree has approximately $4n$ nodes.
`,
    difficulty: 'Hard',
    optimizedCode: `class SegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n).fill(0);
    this.build(arr, 1, 0, this.n - 1);
  }
  build(arr, node, start, end) {
    if (start === end) {
      this.tree[node] = arr[start];
      return;
    }
    let mid = Math.floor((start + end) / 2);
    this.build(arr, 2 * node, start, mid);
    this.build(arr, 2 * node + 1, mid + 1, end);
    this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
  }
  query(node, start, end, l, r) {
    if (r < start || end < l) return 0;
    if (l <= start && end <= r) return this.tree[node];
    let mid = Math.floor((start + end) / 2);
    return this.query(2 * node, start, mid, l, r) +
           this.query(2 * node + 1, mid + 1, end, l, r);
  }
}`,
    quiz: [
      {
        question: "What is the primary use of a Segment Tree?",
        options: ["Sorting an array", "Range queries and point updates", "Finding the shortest path", "Cycle detection"],
        correctAnswer: 1,
        explanation: "Segment Trees are designed to efficiently handle queries over intervals (ranges) and updates to individual elements."
      },
      {
        question: "What is the time complexity for building a Segment Tree for an array of size n?",
        options: ["O(log n)", "O(n)", "O(n log n)", "O(n²)"],
        correctAnswer: 1,
        explanation: "Building the tree involves visiting each of the ~4n nodes once, resulting in O(n) time."
      },
      {
        question: "What is the time complexity of a range query (e.g., range sum) in a Segment Tree?",
        options: ["O(1)", "O(log n)", "O(n)", "O(sqrt(n))"],
        correctAnswer: 1,
        explanation: "A range query traverses at most 4 * log(n) nodes, ensuring O(log n) performance."
      },
      {
        question: "What is the time complexity of a point update in a Segment Tree?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "Updating a single element requires updating one leaf and its ancestors, which is O(log n) steps."
      },
      {
        question: "How many nodes are typically required for a Segment Tree of an array of size n?",
        options: ["n", "2n", "4n", "n²"],
        correctAnswer: 2,
        explanation: "A Segment Tree for n elements can require up to 4n nodes to ensure all intervals are covered."
      },
      {
        question: "What do the leaf nodes in a Segment Tree represent?",
        options: ["The sum of the whole array", "Individual elements of the array", "The root of the tree", "Empty intervals"],
        correctAnswer: 1,
        explanation: "Each leaf node corresponds to a single element from the original input array."
      },
      {
        question: "What do internal nodes in a Segment Tree represent?",
        options: ["Random values", "The merge (e.g., sum, min, max) of their children's intervals", "Pointers to other trees", "The original array elements"],
        correctAnswer: 1,
        explanation: "Internal nodes store the result of an operation (like sum or min) applied to the range covered by their children."
      },
      {
        question: "Is a Segment Tree a static or dynamic structure?",
        options: ["Static structure, dynamic values", "Completely static", "Completely dynamic", "None of the above"],
        correctAnswer: 0,
        explanation: "The structure (intervals covered) is fixed at build time, but the values can be updated dynamically."
      },
      {
        question: "Which problem can be solved efficiently using a Segment Tree?",
        options: ["Finding the median of an array", "Range Minimum Query (RMQ)", "String matching", "Sorting"],
        correctAnswer: 1,
        explanation: "RMQ is a classic application where Segment Trees provide O(log n) queries."
      },
      {
        question: "What is the root node's interval in a Segment Tree for an array of size n?",
        options: ["[0, 0]", "[0, n-1]", "[n-1, n-1]", "[0, 1]"],
        correctAnswer: 1,
        explanation: "The root node represents the entire range of the array, from index 0 to n-1."
      }
    ]
  },
  'fenwick-tree': {
    title: 'Fenwick Tree (Binary Indexed Tree)',
    description: 'A data structure that can efficiently update elements and calculate prefix sums in a table of numbers.',
    timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(n)',
    pseudocode: `procedure update(i, delta):
    while i <= n:
        BIT[i] += delta
        i += i & (-i)`,
    industryUse: 'Used for efficient range sum queries and point updates, often in competitive programming.',
    detailedExplanation: `### How it Works
A Fenwick Tree, also known as a Binary Indexed Tree (BIT), is a data structure that can efficiently update elements and calculate prefix sums in a table of numbers. It is much more memory-efficient than a Segment Tree and easier to implement for certain types of problems.

### Advantages
- **Space**: Uses only $O(n)$ space (the same as the original array).
- **Implementation**: Very concise code compared to Segment Trees.
- **Performance**: Extremely fast in practice due to low constant factors.
`,
    difficulty: 'Hard',
    optimizedCode: `class FenwickTree {
  constructor(n) {
    this.tree = new Array(n + 1).fill(0);
  }
  update(i, delta) {
    for (; i < this.tree.length; i += i & -i) {
      this.tree[i] += delta;
    }
  }
  query(i) {
    let sum = 0;
    for (; i > 0; i -= i & -i) {
      sum += this.tree[i];
    }
    return sum;
  }
}`,
    quiz: [
      {
        question: "What is another common name for a Fenwick Tree?",
        options: ["Segment Tree", "Binary Indexed Tree (BIT)", "AVL Tree", "Trie"],
        correctAnswer: 1,
        explanation: "Fenwick Tree is widely known as a Binary Indexed Tree."
      },
      {
        question: "What is the space complexity of a Fenwick Tree?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 2,
        explanation: "A Fenwick Tree uses an array of size n+1, resulting in O(n) space complexity."
      },
      {
        question: "What is the time complexity for updating an element in a Fenwick Tree?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "Both update and query operations take O(log n) time."
      },
      {
        question: "What is the time complexity for calculating a prefix sum in a Fenwick Tree?",
        options: ["O(1)", "O(log n)", "O(n)", "O(sqrt(n))"],
        correctAnswer: 1,
        explanation: "Prefix sum queries traverse at most log(n) nodes, ensuring O(log n) performance."
      },
      {
        question: "Why is a Fenwick Tree often preferred over a Segment Tree for prefix sums?",
        options: ["It's faster for all operations", "It's more memory-efficient and easier to implement", "It can handle more types of queries", "It's a binary tree"],
        correctAnswer: 1,
        explanation: "Fenwick Trees use O(n) space compared to O(4n) for Segment Trees and have much simpler code."
      },
      {
        question: "What bitwise operation is central to navigating a Fenwick Tree?",
        options: ["i | (i + 1)", "i & -i", "i ^ (i - 1)", "~i"],
        correctAnswer: 1,
        explanation: "The expression `i & -i` isolates the least significant bit, which is used to find parent/child indices."
      },
      {
        question: "Can a Fenwick Tree handle range updates?",
        options: ["Yes, with modifications", "No, only point updates", "Only for small ranges", "Only for powers of 2"],
        correctAnswer: 0,
        explanation: "While standard BIT handles point updates/range queries, it can be modified to handle range updates/point queries or even range updates/range queries."
      },
      {
        question: "What is the constant factor performance of a Fenwick Tree?",
        options: ["Very high", "Moderate", "Very low (extremely fast)", "Variable"],
        correctAnswer: 2,
        explanation: "Fenwick Trees have very low constant factors, often making them faster than Segment Trees in practice."
      },
      {
        question: "Is a Fenwick Tree easier to implement than a Segment Tree?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "The implementation of a BIT is significantly shorter and less error-prone than a Segment Tree."
      },
      {
        question: "What is the index of the first element in a standard Fenwick Tree implementation?",
        options: ["0", "1", "-1", "Any"],
        correctAnswer: 1,
        explanation: "Fenwick Trees are typically 1-indexed to make the bitwise navigation work correctly."
      }
    ]
  },
  'trie': {
    title: 'Trie (Prefix Tree)',
    description: 'An ordered tree data structure used to store a dynamic set or associative array where the keys are usually strings.',
    timeComplexity: { best: 'O(k) (k=length of string)', average: 'O(k)', worst: 'O(k)' },
    spaceComplexity: 'O(ALPHABET_SIZE * k * n)',
    pseudocode: `procedure insert(word):
    curr := root
    for char in word:
        if char not in curr.children: curr.children[char] := Node()
        curr := curr.children[char]
    curr.isEndOfWord := true`,
    industryUse: 'Used in autocomplete features, spell checkers, and IP routing tables.',
    detailedExplanation: `### How it Works
A Trie, also known as a prefix tree, is an ordered tree data structure used to store a dynamic set or associative array where the keys are usually strings. Unlike binary search trees, no node in the tree stores the key associated with that node; instead, its position in the tree defines the key with which it is associated.

### Key Characteristics
- **Prefix-Based**: All descendants of a node have a common prefix of the string associated with that node.
- **Efficient String Search**: The time complexity for searching a string of length $k$ is $O(k)$, which is independent of the number of strings stored in the trie.
- **Space-Time Trade-off**: Tries can use a lot of memory if the alphabet size is large, but they are extremely fast for prefix-based lookups.

### Common Operations
- **Insert**: Traverse the tree according to the characters of the string, creating nodes as needed.
- **Search**: Traverse the tree; if you reach the end of the string and the current node is marked as "end of word," the string exists.
- **Prefix Search**: Similar to search, but only checks if a path exists for the given prefix.
`,
    difficulty: 'Medium',
    optimizedCode: `// Trie implementation...`,
    quiz: [
      {
        question: "What is another name for a Trie?",
        options: ["Binary Search Tree", "Prefix Tree", "Suffix Tree", "Heap"],
        correctAnswer: 1,
        explanation: "Trie is called a Prefix Tree because it's optimized for prefix-based lookups."
      },
      {
        question: "What is the time complexity for searching a string of length k in a Trie?",
        options: ["O(n)", "O(log n)", "O(k)", "O(n * k)"],
        correctAnswer: 2,
        explanation: "Search time depends only on the length of the string being searched, not the number of strings in the Trie."
      },
      {
        question: "Is the search time in a Trie independent of the number of stored strings?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Yes, the search complexity is O(k), where k is the string length, regardless of how many words are in the Trie."
      },
      {
        question: "What is a common real-world application of Tries?",
        options: ["Sorting numbers", "Autocomplete and spell checkers", "Finding shortest paths", "Image processing"],
        correctAnswer: 1,
        explanation: "Tries are ideal for autocomplete because they can quickly find all words sharing a common prefix."
      },
      {
        question: "What is the space complexity of a Trie?",
        options: ["O(n)", "O(n * k)", "O(Alphabet_Size * k * n)", "O(1)"],
        correctAnswer: 2,
        explanation: "In the worst case, each character of every string requires a new node with pointers for the entire alphabet."
      },
      {
        question: "Does a node in a Trie explicitly store the character it represents?",
        options: ["Yes", "No, its position in the tree defines the character"],
        correctAnswer: 1,
        explanation: "The character is usually represented by the index in the parent's children array, not stored in the node itself."
      },
      {
        question: "What is the 'Prefix Property' of a Trie?",
        options: ["All nodes have the same prefix", "All descendants of a node share a common prefix", "The root is the prefix", "Strings are stored in reverse"],
        correctAnswer: 1,
        explanation: "All strings stored in the subtree of a node share the prefix represented by the path from the root to that node."
      },
      {
        question: "How does alphabet size affect a Trie?",
        options: ["It doesn't", "Larger alphabet increases memory usage per node", "Larger alphabet makes it faster", "It only affects the root"],
        correctAnswer: 1,
        explanation: "Each node typically contains an array of pointers of size equal to the alphabet size."
      },
      {
        question: "Is a Trie a binary tree?",
        options: ["Yes", "No"],
        correctAnswer: 1,
        explanation: "No, a Trie node can have as many children as there are characters in the alphabet."
      },
      {
        question: "What is the 'isEndOfWord' flag used for?",
        options: ["To mark the root", "To indicate that a complete word ends at this node", "To delete the node", "To count children"],
        correctAnswer: 1,
        explanation: "Since prefixes are also stored, this flag distinguishes between a prefix and a complete word."
      }
    ]
  },
  'n-ary-tree': {
    title: 'N-ary Tree',
    description: 'A tree in which each node has no more than N children.',
    timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    pseudocode: `class Node:
    data, children[]`,
    industryUse: 'Used in file systems, DOM (Document Object Model), and representing organizational structures.',
    detailedExplanation: `### How it Works
An N-ary Tree is a tree in which each node has no more than $N$ children. It is a generalization of a binary tree, where $N=2$.

### Key Characteristics
- **Hierarchical**: Used to represent data with a complex parent-child relationship where a parent can have many children.
- **Flexible**: The number of children can vary from node to node, up to the maximum $N$.
- **Traversals**: Similar to binary trees, N-ary trees can be traversed using Depth-First Search (Pre-order, Post-order) and Breadth-First Search (Level-order).

### Real-World Examples
- **File Systems**: A folder can contain many files and other sub-folders.
- **DOM**: An HTML element can have many child elements.
- **Organization Charts**: A manager can have many direct reports.
`,
    difficulty: 'Medium',
    optimizedCode: `class Node {
  constructor(data) {
    this.data = data;
    this.children = [];
  }
  addChild(node) {
    this.children.push(node);
  }
}`,
    quiz: [
      {
        question: "What is an N-ary Tree?",
        options: ["A tree with exactly N nodes", "A tree where each node has at most N children", "A tree with N levels", "A tree where all nodes have N children"],
        correctAnswer: 1,
        explanation: "An N-ary tree generalizes a binary tree by allowing up to N children per node."
      },
      {
        question: "A Binary Tree is a special case of an N-ary Tree where N equals?",
        options: ["1", "2", "3", "0"],
        correctAnswer: 1,
        explanation: "A binary tree is an N-ary tree with N=2."
      },
      {
        question: "Which of the following is a real-world example of an N-ary tree?",
        options: ["File system directory structure", "HTML DOM", "Organization chart", "All of the above"],
        correctAnswer: 3,
        explanation: "All these structures involve a parent having multiple children, which is the core of an N-ary tree."
      },
      {
        question: "How are children typically stored in an N-ary tree node?",
        options: ["Two pointers (left and right)", "An array or list of pointers", "A hash map", "A single pointer"],
        correctAnswer: 1,
        explanation: "Since the number of children can vary, an array or list is used to store child references."
      },
      {
        question: "What is the time complexity of traversing an N-ary tree with n nodes?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 2,
        explanation: "Traversing all nodes (e.g., using DFS or BFS) takes O(n) time."
      },
      {
        question: "Which traversal method visits all nodes at the same depth before moving deeper?",
        options: ["Preorder", "Postorder", "Breadth-First Search (Level-order)", "Inorder"],
        correctAnswer: 2,
        explanation: "BFS explores the tree level by level."
      },
      {
        question: "What is the 'Root' of an N-ary tree?",
        options: ["Any leaf node", "The topmost node with no parent", "The node with the most children", "The middle node"],
        correctAnswer: 1,
        explanation: "The root is the unique starting node of the tree."
      },
      {
        question: "What is a 'Leaf' node in an N-ary tree?",
        options: ["A node with N children", "A node with no children", "The root node", "A node with one child"],
        correctAnswer: 1,
        explanation: "Leaf nodes are the terminal nodes of the tree."
      },
      {
        question: "What is the 'Height' of an N-ary tree?",
        options: ["Number of nodes", "Number of edges on the longest path from root to a leaf", "Maximum number of children", "Number of levels minus one"],
        correctAnswer: 1,
        explanation: "Height measures the maximum distance from the root to any leaf."
      },
      {
        question: "What is the space complexity of an N-ary tree with n nodes?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 2,
        explanation: "Storing n nodes requires O(n) space."
      }
    ]
  },
  'min-heap': {
    title: 'Min Heap',
    description: 'A complete binary tree where the value of each node is less than or equal to the values of its children.',
    timeComplexity: { best: 'O(1) (Get Min)', average: 'O(log n) (Insert)', worst: 'O(log n) (Insert)' },
    spaceComplexity: 'O(n)',
    pseudocode: `procedure insert(val):
    heap.append(val)
    bubbleUp(length(heap) - 1)`,
    industryUse: 'Used in priority queues and algorithms like Dijkstra\'s and Prim\'s.',
    detailedExplanation: `### How it Works
A Min Heap is a complete binary tree where the value of each node is less than or equal to the values of its children. This means the smallest element is always at the root.

### Key Properties
- **Shape Property**: It is a complete binary tree (all levels are filled except possibly the last, which is filled from left to right).
- **Heap Property**: The value of the parent is always less than or equal to the values of its children.
- **Array Representation**: Heaps are typically implemented using arrays for efficiency. For a node at index $i$:
  - Left child: $2i + 1$
  - Right child: $2i + 2$
  - Parent: $\lfloor (i - 1) / 2 \rfloor$

### Common Operations
- **Insert**: Add the element at the end and "bubble up" to restore the heap property.
- **Extract Min**: Remove the root, replace it with the last element, and "bubble down" to restore the heap property.
`,
    difficulty: 'Medium',
    optimizedCode: `class MinHeap {
  constructor() { this.heap = []; }
  insert(val) {
    this.heap.push(val);
    this.bubbleUp();
  }
  bubbleUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex] <= this.heap[index]) break;
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }
}`,
    quiz: [
      {
        question: "What is the core property of a Min Heap?",
        options: ["Root is the largest element", "Root is the smallest element", "It is a sorted array", "All nodes have 2 children"],
        correctAnswer: 1,
        explanation: "In a Min Heap, the value of each node is less than or equal to the values of its children, making the root the minimum."
      },
      {
        question: "What is the 'Shape Property' of a Heap?",
        options: ["It must be a full binary tree", "It must be a complete binary tree", "It must be a perfect binary tree", "It can be any tree"],
        correctAnswer: 1,
        explanation: "Heaps must be complete binary trees, meaning all levels are filled except possibly the last, which is filled from left to right."
      },
      {
        question: "How is a Min Heap typically implemented for efficiency?",
        options: ["Linked List", "Array", "Hash Map", "Stack"],
        correctAnswer: 1,
        explanation: "Arrays are used because the complete binary tree structure allows for easy index-based parent/child navigation."
      },
      {
        question: "In an array-based heap, what is the left child index of a node at index i?",
        options: ["i + 1", "2i", "2i + 1", "2i + 2"],
        correctAnswer: 2,
        explanation: "The left child is located at index 2i + 1 (using 0-based indexing)."
      },
      {
        question: "In an array-based heap, what is the right child index of a node at index i?",
        options: ["i + 2", "2i + 1", "2i + 2", "2i"],
        correctAnswer: 2,
        explanation: "The right child is located at index 2i + 2 (using 0-based indexing)."
      },
      {
        question: "What is the time complexity of inserting an element into a Min Heap?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "Insertion involves adding to the end and 'bubbling up', which takes time proportional to the tree height, O(log n)."
      },
      {
        question: "What is the time complexity of extracting the minimum element?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "Extracting the root involves replacing it with the last element and 'bubbling down', taking O(log n) time."
      },
      {
        question: "What is the time complexity of getting the minimum element (without removing it)?",
        options: ["O(1)", "O(log n)", "O(n)", "O(1)"],
        correctAnswer: 0,
        explanation: "The minimum element is always at the root (index 0), so it can be accessed in constant time."
      },
      {
        question: "Which algorithm uses a Min Heap to efficiently find the next node to visit?",
        options: ["Bubble Sort", "Dijkstra's Algorithm", "Binary Search", "DFS"],
        correctAnswer: 1,
        explanation: "Dijkstra's uses a priority queue (often implemented as a Min Heap) to always pick the node with the smallest distance."
      },
      {
        question: "What is the 'Bubble Up' (or Sift Up) operation?",
        options: ["Moving a small value up the tree to restore heap property", "Moving a large value down", "Deleting a node", "Sorting the heap"],
        correctAnswer: 0,
        explanation: "When a new element is added at the bottom, it is swapped with its parent until the heap property is restored."
      },
      {
        question: "In a Min-Heap, where is the smallest element located?",
        options: ["At the root", "At a leaf node", "In the middle"],
        correctAnswer: 0,
        explanation: "By definition, the root of a Min-Heap contains the minimum value in the entire heap."
      }
    ]
  },
  'linear-search': {
    title: 'Linear Search',
    description: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.',
    timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(1)',
    stability: 'Yes',
    inPlace: 'Yes',
    adaptive: 'No',
    pseudocode: `procedure linearSearch(A, target)
    for i := 0 to length(A) - 1 do
        if A[i] == target then
            return i
        end if
    end for
    return -1
end procedure`,
    industryUse: 'Used for small, unsorted datasets or when the cost of sorting the data outweighs the benefit of a faster search.',
    detailedExplanation: `### How it Works
Linear Search is the simplest search algorithm. It starts at one end and goes through each element of a list until the desired element is found, otherwise the search continues till the end of the data set.

### Key Characteristics
- **No Prerequisite**: Unlike Binary Search, the data does not need to be sorted.
- **Simple**: Very easy to implement and understand.
- **Inefficient for Large Data**: Its time complexity is $O(n)$, making it slow for large collections.

### Step-by-Step Breakdown
1. Start from the first element (index 0).
2. Compare the current element with the target value.
3. If the current element matches the target, return its index.
4. If not, move to the next element.
5. Repeat steps 2-4 until the target is found or the end of the array is reached.
6. If the end is reached without a match, return -1.
`,
    difficulty: 'Easy',
    optimizedCode: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
    quiz: [
      {
        question: "What is the time complexity of Linear Search in the worst case?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 2,
        explanation: "In the worst case, the target element is at the very end of the array or not present at all, requiring n comparisons."
      },
      {
        question: "Linear Search is most suitable for which type of data?",
        options: ["Large sorted arrays", "Small unsorted datasets", "Binary Search Trees", "Hash Tables"],
        correctAnswer: 1,
        explanation: "Linear Search is simple and doesn't require the data to be sorted, making it ideal for small, unsorted collections."
      },
      {
        question: "What is the prerequisite for Linear Search?",
        options: ["Data must be sorted", "Data must be in a linked list", "None", "Data must be positive"],
        correctAnswer: 2,
        explanation: "Linear Search can be performed on any linear collection, regardless of whether it's sorted."
      },
      {
        question: "What is the best-case time complexity of Linear Search?",
        options: ["O(1)", "O(log n)", "O(n)", "O(0)"],
        correctAnswer: 0,
        explanation: "The best case occurs when the target element is the very first element in the array."
      },
      {
        question: "What is the space complexity of Linear Search?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Linear Search only requires a constant amount of extra space for the loop variable."
      },
      {
        question: "Which search method does Linear Search use?",
        options: ["Divide and conquer", "Sequential", "Random", "Binary"],
        correctAnswer: 1,
        explanation: "Linear Search checks each element one by one in sequence."
      },
      {
        question: "Is Linear Search an adaptive algorithm?",
        options: ["Yes", "No"],
        correctAnswer: 1,
        explanation: "Standard Linear Search does not change its behavior based on the input data's order."
      },
      {
        question: "Is Linear Search stable?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Yes, it always finds the first occurrence of the target if multiple exist."
      },
      {
        question: "When is Linear Search preferred over Binary Search?",
        options: ["Always", "When the data is unsorted and small", "When the data is very large", "When memory is limited"],
        correctAnswer: 1,
        explanation: "If data is unsorted, sorting it just to perform one search is more expensive than a linear search."
      },
      {
        question: "How many comparisons are made in the worst case for an array of size n?",
        options: ["1", "log n", "n", "n-1"],
        correctAnswer: 2,
        explanation: "In the worst case, every element in the array is checked once."
      }
    ],
    javaCode: `public class LinearSearch {
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) return i;
        }
        return -1;
    }
}`,
    pythonCode: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
    cppCode: `#include <vector>

int linearSearch(const std::vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
    csharpCode: `public class LinearSearch {
    public static int Search(int[] arr, int target) {
        for (int i = 0; i < arr.Length; i++) {
            if (arr[i] == target) return i;
        }
        return -1;
    }
}`
  },
  'binary-search': {
    title: 'Binary Search',
    description: 'Finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.',
    timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(1)',
    stability: 'Yes',
    inPlace: 'Yes',
    adaptive: 'No',
    pseudocode: `procedure binarySearch(A, target)
    low := 0, high := length(A) - 1
    while low <= high do
        mid := (low + high) / 2
        if A[mid] == target then return mid
        else if A[mid] < target then low := mid + 1
        else high := mid - 1
    end while
    return -1
end procedure`,
    industryUse: 'Fundamental in computer science. Used in database indexing, version control systems (git bisect), and anytime searching in sorted data is required.',
    detailedExplanation: `### How it Works
Binary Search is an efficient algorithm for finding an item from a **sorted** list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you've narrowed down the possible locations to just one.

### Key Requirements
- The data structure must allow **random access** (like an array).
- The data must be **sorted** in ascending or descending order.

### Step-by-Step Breakdown
1. Compare the target value to the middle element of the array.
2. If the target value is equal to the middle element, the search is successful.
3. If the target value is less than the middle element, repeat the search on the left half.
4. If the target value is greater than the middle element, repeat the search on the right half.
5. Continue until the target is found or the search space is empty.

### Why Logarithmic?
Because the search space is halved in each step, the number of steps required to find an element in an array of size $n$ is at most $\lceil \log_2 n \rceil$. For example, searching in 1,000,000 elements takes at most 20 steps!
`,
    difficulty: 'Easy',
    optimizedCode: `function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2); // Prevents overflow
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    quiz: [
      {
        question: "What is the prerequisite for Binary Search to work?",
        options: ["The array must be unsorted", "The array must be sorted", "The array must contain only positive numbers", "The array size must be a power of 2"],
        correctAnswer: 1,
        explanation: "Binary Search relies on the sorted property to eliminate half of the search space in each step."
      },
      {
        question: "What is the time complexity of Binary Search?",
        options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
        correctAnswer: 2,
        explanation: "Each step reduces the search space by half, leading to a logarithmic number of steps: O(log n)."
      },
      {
        question: "What is the best-case time complexity of Binary Search?",
        options: ["O(1)", "O(log n)", "O(n)", "O(0)"],
        correctAnswer: 0,
        explanation: "The best case occurs when the target element is exactly at the middle of the initial array."
      },
      {
        question: "What is the space complexity of iterative Binary Search?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Iterative Binary Search only uses a few variables (low, high, mid), requiring constant space."
      },
      {
        question: "Which algorithmic paradigm does Binary Search follow?",
        options: ["Greedy", "Dynamic Programming", "Divide and Conquer", "Backtracking"],
        correctAnswer: 2,
        explanation: "It divides the problem into smaller subproblems (halves) and solves them."
      },
      {
        question: "Does Binary Search require random access to elements?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Yes, it needs to jump to the middle element in O(1) time, which requires an array or similar structure."
      },
      {
        question: "Approximately how many comparisons are needed to find an element in 1,000,000 sorted items?",
        options: ["1,000,000", "500,000", "20", "100"],
        correctAnswer: 2,
        explanation: "log2(1,000,000) is approximately 20."
      },
      {
        question: "Why is `low + (high - low) / 2` preferred over `(low + high) / 2`?",
        options: ["It's faster", "It prevents integer overflow", "It's more accurate", "It's required by JavaScript"],
        correctAnswer: 1,
        explanation: "If low and high are very large, their sum might exceed the maximum integer value."
      },
      {
        question: "In which real-world scenario is Binary Search used?",
        options: ["Database indexing", "Git bisect", "Searching in sorted dictionaries", "All of the above"],
        correctAnswer: 3,
        explanation: "Binary search is a fundamental tool for efficient searching in any sorted data."
      },
      {
        question: "Is Binary Search stable?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Standard Binary Search can be made stable by continuing to search for the first occurrence if a match is found."
      }
    ],
    javaCode: `public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}`,
    pythonCode: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
    cppCode: `#include <vector>

int binarySearch(const std::vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
    csharpCode: `public class BinarySearch {
    public static int Search(int[] arr, int target) {
        int low = 0, high = arr.Length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}`
  },
  'linked-list': {
    title: 'Singly Linked List',
    description: 'A linear data structure where elements are stored in nodes, and each node points to the next node in the sequence.',
    timeComplexity: { best: 'O(1) (Insert at head)', average: 'O(n) (Search)', worst: 'O(n) (Search)' },
    spaceComplexity: 'O(n)',
    pseudocode: `class Node:
    data, next

class LinkedList:
    head
    procedure insert(data):
        newNode := Node(data)
        newNode.next := head
        head := newNode`,
    industryUse: 'Used in dynamic memory allocation, implementing stacks/queues, and in applications where frequent insertion/deletion is required without resizing.',
    detailedExplanation: `### How it Works
A Singly Linked List is a linear data structure where each element is a separate object called a **node**. Each node contains two items: the data and a reference (or link) to the next node in the sequence.

### Key Components
- **Node**: The basic building block, containing data and a \`next\` pointer.
- **Head**: A pointer to the first node in the list.
- **Null/None**: The \`next\` pointer of the last node points to null, indicating the end of the list.

### Advantages vs. Arrays
- **Dynamic Size**: Can grow or shrink at runtime without expensive reallocations.
- **Efficient Insertions/Deletions**: Adding or removing an element at the beginning takes $O(1)$ time.

### Disadvantages
- **No Random Access**: To reach the $n$-th element, you must traverse all preceding nodes ($O(n)$).
- **Extra Memory**: Each node requires additional space for the pointer.
`,
    difficulty: 'Easy',
    optimizedCode: `class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  
  insertAtHead(data) {
    const newNode = new Node(data);
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
  }
}`,
    quiz: [
      {
        question: "What is the time complexity of searching for an element in a singly linked list?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 2,
        explanation: "In a singly linked list, you may need to traverse the entire list to find an element, resulting in O(n) complexity."
      },
      {
        question: "Which of the following is an advantage of a Linked List over an Array?",
        options: ["Faster random access", "Lower memory overhead", "Dynamic size", "Better cache locality"],
        correctAnswer: 2,
        explanation: "Linked Lists can easily grow or shrink in size without needing to reallocate or shift elements, unlike traditional arrays."
      },
      {
        question: "Why does a Linked List not support efficient random access?",
        options: ["Nodes are stored in non-contiguous memory", "Pointers are slow", "It uses too much memory", "It's a linear structure"],
        correctAnswer: 0,
        explanation: "Since nodes are scattered in memory, you must follow pointers from the head to reach a specific index."
      },
      {
        question: "What is the time complexity of inserting a node at the head of a linked list?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Inserting at the head only requires updating two pointers, regardless of the list size."
      },
      {
        question: "What is the space complexity of a Linked List with n nodes?",
        options: ["O(1)", "O(n)", "O(2n)", "O(log n)"],
        correctAnswer: 1,
        explanation: "Each node stores data and a pointer, so space grows linearly with the number of elements."
      },
      {
        question: "What are the basic components of a Linked List node?",
        options: ["Data and Index", "Data and Pointer to next node", "Key and Value", "Left and Right children"],
        correctAnswer: 1,
        explanation: "A node consists of the actual data and a reference to the next node in the sequence."
      },
      {
        question: "How do you identify the end of a singly linked list?",
        options: ["The next pointer is 0", "The next pointer is null", "The data is empty", "The size is reached"],
        correctAnswer: 1,
        explanation: "The last node in the list has a 'next' pointer that points to null."
      },
      {
        question: "What is the memory overhead of a Linked List compared to an Array?",
        options: ["Lower", "Higher", "Same", "Zero"],
        correctAnswer: 1,
        explanation: "Linked lists require extra memory to store the pointers/references for each node."
      },
      {
        question: "In which scenario is a Linked List preferred over an Array?",
        options: ["Frequent random access", "Frequent insertions/deletions at the beginning", "Memory efficiency", "Sorting large data"],
        correctAnswer: 1,
        explanation: "Linked lists excel at insertions and deletions because they don't require shifting other elements."
      },
      {
        question: "To reach the n-th element in a linked list, how many nodes must you traverse?",
        options: ["1", "log n", "n", "n-1"],
        correctAnswer: 2,
        explanation: "You must start at the head and follow n-1 pointers to reach the n-th node."
      }
    ]
  },
  'stack': {
    title: 'Stack (LIFO)',
    description: 'A linear data structure that follows the Last-In-First-Out principle. Elements are added and removed from the same end.',
    timeComplexity: { best: 'O(1) (Push/Pop)', average: 'O(1)', worst: 'O(1)' },
    spaceComplexity: 'O(n)',
    pseudocode: `procedure push(item):
    top := top + 1
    stack[top] := item

procedure pop():
    item := stack[top]
    top := top - 1
    return item`,
    industryUse: 'Used in function call management (call stack), undo/redo features in editors, and expression parsing (postfix/prefix).',
    detailedExplanation: `### How it Works
A Stack is a linear data structure that follows the **Last-In-First-Out (LIFO)** principle. This means the last element added to the stack will be the first one to be removed. Think of it like a stack of plates; you add a plate to the top and take the top one off first.

### Core Operations
- **Push**: Adds an element to the top of the stack.
- **Pop**: Removes the top element from the stack.
- **Peek/Top**: Returns the top element without removing it.
- **IsEmpty**: Checks if the stack is empty.

### Real-World Applications
- **Undo/Redo**: Most software uses a stack to keep track of user actions.
- **Function Calls**: Compilers use a "call stack" to manage function execution and local variables.
- **Backtracking**: Used in algorithms to find paths or solve puzzles (like mazes).
`,
    difficulty: 'Easy',
    optimizedCode: `class Stack {
  constructor() {
    this.items = [];
  }
  push(element) { this.items.push(element); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}`,
    quiz: [
      {
        question: "Which principle does a Stack follow?",
        options: ["FIFO (First-In-First-Out)", "LIFO (Last-In-First-Out)", "LILO (Last-In-Last-Out)", "FILO (First-In-Last-Out)"],
        correctAnswer: 1,
        explanation: "A Stack follows the Last-In-First-Out (LIFO) principle, where the last element added is the first one to be removed."
      },
      {
        question: "What is the time complexity of the 'pop' operation in a stack implemented with an array?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        correctAnswer: 2,
        explanation: "Removing the top element from a stack is a constant time operation, O(1)."
      },
      {
        question: "What is the time complexity of the 'push' operation?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Adding an element to the top of a stack is a constant time operation, O(1)."
      },
      {
        question: "What does the 'peek' operation do?",
        options: ["Removes the top element", "Returns the top element without removing it", "Adds a new element", "Clears the stack"],
        correctAnswer: 1,
        explanation: "Peek allows you to see the top element without modifying the stack."
      },
      {
        question: "Which of the following is a classic application of a Stack?",
        options: ["Undo/Redo functionality", "Function call management (Call Stack)", "Expression parsing", "All of the above"],
        correctAnswer: 3,
        explanation: "Stacks are fundamental for managing nested structures like function calls and undo histories."
      },
      {
        question: "Is a Stack a linear or non-linear data structure?",
        options: ["Linear", "Non-linear", "Hierarchical", "Cyclic"],
        correctAnswer: 0,
        explanation: "A stack is a linear data structure where elements are arranged in a sequence."
      },
      {
        question: "What is the time complexity of checking if a stack is empty?",
        options: ["O(1)", "O(n)", "O(log n)", "O(V+E)"],
        correctAnswer: 0,
        explanation: "Checking the size or top pointer is a constant time operation."
      },
      {
        question: "Which algorithm uses a stack for backtracking?",
        options: ["BFS", "DFS", "Binary Search", "Dijkstra"],
        correctAnswer: 1,
        explanation: "DFS uses a stack (either explicit or the call stack) to explore branches and backtrack."
      },
      {
        question: "Can a stack be used to reverse a string?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Yes, by pushing all characters onto a stack and then popping them off, the order is reversed."
      },
      {
        question: "What happens if you try to pop from an empty stack?",
        options: ["Stack Overflow", "Stack Underflow", "Nothing", "The program crashes"],
        correctAnswer: 1,
        explanation: "Attempting to remove an element from an empty stack is called an underflow error."
      }
    ]
  },
  'queue': {
    title: 'Queue (FIFO)',
    description: 'A linear data structure that follows the First-In-First-Out principle. Elements are added at the rear and removed from the front.',
    timeComplexity: { best: 'O(1) (Enqueue/Dequeue)', average: 'O(1)', worst: 'O(1)' },
    spaceComplexity: 'O(n)',
    pseudocode: `procedure enqueue(item):
    rear := rear + 1
    queue[rear] := item

procedure dequeue():
    item := queue[front]
    front := front + 1
    return item`,
    industryUse: 'Used in task scheduling (OS), handling requests in web servers, and breadth-first search algorithms.',
    detailedExplanation: `### How it Works
A Queue is a linear data structure that follows the **First-In-First-Out (FIFO)** principle. This means the first element added to the queue will be the first one to be removed. Think of it like a line of people waiting for a bus; the person who arrived first is served first.

### Core Operations
- **Enqueue**: Adds an element to the rear (end) of the queue.
- **Dequeue**: Removes the front element from the queue.
- **Front**: Returns the front element without removing it.
- **Rear**: Returns the last element without removing it.

### Real-World Applications
- **Task Scheduling**: Operating systems use queues to manage processes waiting for CPU time.
- **Print Spooling**: Documents sent to a printer are placed in a queue.
- **Breadth-First Search (BFS)**: Uses a queue to explore nodes level by level.
`,
    difficulty: 'Easy',
    optimizedCode: `class Queue {
  constructor() {
    this.items = {};
    this.head = 0;
    this.tail = 0;
  }
  enqueue(item) { this.items[this.tail++] = item; }
  dequeue() {
    const item = this.items[this.head];
    delete this.items[this.head++];
    return item;
  }
}`,
    quiz: [
      {
        question: "Which principle does a Queue follow?",
        options: ["LIFO", "FIFO", "Random Access", "Priority Based"],
        correctAnswer: 1,
        explanation: "A Queue follows the First-In-First-Out (FIFO) principle, similar to a line of people waiting for service."
      },
      {
        question: "In a circular queue, how is the next position for enqueue calculated?",
        options: ["(rear + 1)", "(rear + 1) % size", "(rear - 1) % size", "rear * 2"],
        correctAnswer: 1,
        explanation: "The modulo operator is used in circular queues to wrap the index back to the beginning of the array."
      },
      {
        question: "What is the time complexity of the 'enqueue' operation?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Adding an element to the rear of a queue is a constant time operation."
      },
      {
        question: "What is the time complexity of the 'dequeue' operation?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Removing the front element from a queue is a constant time operation."
      },
      {
        question: "Which of the following is a real-world application of a Queue?",
        options: ["Task scheduling in OS", "Print spooling", "Handling web server requests", "All of the above"],
        correctAnswer: 3,
        explanation: "Queues are essential for managing resources that are shared among multiple users or processes."
      },
      {
        question: "Which graph traversal algorithm uses a Queue?",
        options: ["DFS", "BFS", "Dijkstra", "Prim's"],
        correctAnswer: 1,
        explanation: "BFS uses a queue to explore nodes level by level."
      },
      {
        question: "Is a Queue a linear data structure?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Yes, elements are arranged in a sequence from front to rear."
      },
      {
        question: "What are the two pointers used in a standard Queue implementation?",
        options: ["Top and Bottom", "Front and Rear", "Left and Right", "Head and Tail"],
        correctAnswer: 1,
        explanation: "Front (or Head) points to the first element, and Rear (or Tail) points to the last."
      },
      {
        question: "How does a Priority Queue differ from a standard Queue?",
        options: ["It's faster", "Elements are removed based on priority, not just arrival order", "It uses less memory", "It's non-linear"],
        correctAnswer: 1,
        explanation: "In a Priority Queue, each element has a priority, and the highest priority element is dequeued first."
      },
      {
        question: "What is a 'Deque'?",
        options: ["A deleted queue", "A double-ended queue", "A sorted queue", "A priority queue"],
        correctAnswer: 1,
        explanation: "A Deque (Double-Ended Queue) allows insertion and deletion from both the front and the rear."
      }
    ]
  },
  'max-heap': {
    title: 'Max Heap',
    description: 'A complete binary tree where the value of each node is greater than or equal to the values of its children.',
    timeComplexity: { best: 'O(1) (Get Max)', average: 'O(log n) (Insert)', worst: 'O(log n) (Insert)' },
    spaceComplexity: 'O(n)',
    pseudocode: `procedure insert(val):
    heap.append(val)
    bubbleUp(length(heap) - 1)

procedure bubbleUp(index):
    while index > 0 and heap[parent(index)] < heap[index]:
        swap(heap[parent(index)], heap[index])
        index := parent(index)`,
    industryUse: 'Used in priority queues, heap sort, and graph algorithms like Dijkstra\'s and Prim\'s.',
    detailedExplanation: `### How it Works
A Max Heap is a complete binary tree where the value of each node is greater than or equal to the values of its children. This means the largest element is always at the root.

### Key Properties
- **Shape Property**: It is a complete binary tree.
- **Heap Property**: The value of the parent is always greater than or equal to the values of its children.
- **Array Representation**: Similar to Min Heap, for a node at index $i$:
  - Left child: $2i + 1$
  - Right child: $2i + 2$
  - Parent: $\lfloor (i - 1) / 2 \rfloor$

### Common Operations
- **Insert**: Add the element at the end and "bubble up" to restore the heap property.
- **Extract Max**: Remove the root, replace it with the last element, and "bubble down" to restore the heap property.
`,
    difficulty: 'Medium',
    optimizedCode: `class MaxHeap {
  constructor() { this.heap = []; }
  insert(val) {
    this.heap.push(val);
    this.bubbleUp();
  }
  bubbleUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex] >= this.heap[index]) break;
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }
}`,
    quiz: [
      {
        question: "What is the time complexity of inserting an element into a binary heap?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "In the worst case, an inserted element might need to be bubbled up from the leaf to the root, which takes O(log n) time."
      },
      {
        question: "In a max-heap represented as an array, what is the index of the parent of a node at index 'i'?",
        options: ["2i + 1", "2i + 2", "floor((i-1)/2)", "i/2"],
        correctAnswer: 2,
        explanation: "For zero-based indexing, the parent of node 'i' is located at floor((i-1)/2)."
      },
      {
        question: "What is the core property of a Max Heap?",
        options: ["Root is the smallest", "Root is the largest", "All nodes are equal", "Leaves are larger than root"],
        correctAnswer: 1,
        explanation: "In a Max Heap, every parent node is greater than or equal to its children."
      },
      {
        question: "What is the shape property of a Max Heap?",
        options: ["Full binary tree", "Complete binary tree", "Perfect binary tree", "Skewed tree"],
        correctAnswer: 1,
        explanation: "Heaps must be complete binary trees to be efficiently represented in an array."
      },
      {
        question: "What is the time complexity of extracting the maximum element from a Max Heap?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "Extracting the root requires swapping with the last element and 'bubbling down', taking O(log n) time."
      },
      {
        question: "What is the time complexity of getting the maximum element (without removal)?",
        options: ["O(1)", "O(log n)", "O(n)", "O(1)"],
        correctAnswer: 0,
        explanation: "The maximum element is always at the root (index 0), accessible in constant time."
      },
      {
        question: "How do you find the left child of node i in an array-based heap?",
        options: ["2i", "2i + 1", "2i + 2", "i/2"],
        correctAnswer: 1,
        explanation: "The left child is at index 2i + 1."
      },
      {
        question: "How do you find the right child of node i in an array-based heap?",
        options: ["2i + 1", "2i + 2", "2i", "i + 2"],
        correctAnswer: 1,
        explanation: "The right child is at index 2i + 2."
      },
      {
        question: "Which sorting algorithm is based on the heap data structure?",
        options: ["Merge Sort", "Quick Sort", "Heap Sort", "Bubble Sort"],
        correctAnswer: 2,
        explanation: "Heap Sort uses a heap to repeatedly extract the maximum/minimum element."
      },
      {
        question: "What is the 'Bubble Up' operation in a Max Heap?",
        options: ["Moving a small value down", "Moving a large value up to restore heap property", "Deleting the root", "Reversing the array"],
        correctAnswer: 1,
        explanation: "When a new large value is added at the end, it is moved up until it is smaller than its parent."
      }
    ]
  },
  'fibonacci-dp': {
    title: 'Fibonacci (Dynamic Programming)',
    description: 'Calculating the nth Fibonacci number using memoization or tabulation to avoid redundant calculations.',
    timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(n) (Memoization) or O(1) (Tabulation)',
    pseudocode: `procedure fib(n):
    if n <= 1 return n
    if memo[n] exists return memo[n]
    memo[n] := fib(n-1) + fib(n-2)
    return memo[n]`,
    industryUse: 'DP is used in financial modeling, bioinformatics (sequence alignment), and resource allocation problems.',
    detailedExplanation: `### How it Works
Dynamic Programming (DP) is an algorithmic technique for solving an optimization problem by breaking it down into simpler subproblems and utilizing the fact that the optimal solution to the overall problem depends upon the optimal solution to its subproblems.

### Fibonacci with DP
In the naive recursive approach, $fib(n)$ recomputes $fib(n-1)$ and $fib(n-2)$ many times. DP avoids this by storing the results of each $fib(i)$ as it's calculated.
`,
    difficulty: 'Medium',
    optimizedCode: `function fibTabulation(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    let temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}`,
    quiz: [
      {
        question: "What is the main goal of Dynamic Programming?",
        options: ["To use more memory", "To avoid redundant calculations by storing results", "To use recursion for every problem", "To sort data faster"],
        correctAnswer: 1,
        explanation: "DP solves complex problems by breaking them into overlapping subproblems and storing the results (memoization or tabulation) to avoid recomputing them."
      },
      {
        question: "What is the time complexity of the optimized (tabulation) Fibonacci algorithm?",
        options: ["O(2^n)", "O(n²)", "O(n)", "O(log n)"],
        correctAnswer: 2,
        explanation: "Tabulation computes each Fibonacci number exactly once in a single loop, resulting in O(n) time complexity."
      },
      {
        question: "What is 'Memoization' in Dynamic Programming?",
        options: ["A way to sort data", "A top-down approach that stores results of expensive function calls", "A bottom-up approach using a table", "A method for deleting data"],
        correctAnswer: 1,
        explanation: "Memoization is a technique where you store the results of function calls and return the cached result when the same inputs occur again."
      },
      {
        question: "What is 'Tabulation' in Dynamic Programming?",
        options: ["A top-down approach", "A bottom-up approach that builds a table from the smallest subproblems", "A way to visualize trees", "A sorting algorithm"],
        correctAnswer: 1,
        explanation: "Tabulation is a bottom-up approach where you solve smaller subproblems first and use their results to solve larger ones, typically using an array."
      },
      {
        question: "Which property must a problem have to be solvable by Dynamic Programming?",
        options: ["Linearity", "Overlapping subproblems and optimal substructure", "Randomness", "No subproblems"],
        correctAnswer: 1,
        explanation: "DP is applicable when a problem can be broken into subproblems that are reused (overlapping) and the optimal solution to the problem contains optimal solutions to subproblems."
      },
      {
        question: "What is the space complexity of the Fibonacci tabulation method using only two variables?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "By only keeping track of the last two Fibonacci numbers, we can reduce space complexity to O(1)."
      },
      {
        question: "How does the recursive Fibonacci algorithm's time complexity compare to the DP version?",
        options: ["Recursive is faster", "DP is much faster (O(n) vs O(2^n))", "They are the same", "Recursive uses less memory"],
        correctAnswer: 1,
        explanation: "The naive recursive version has exponential time complexity O(2^n), while the DP version is linear O(n)."
      },
      {
        question: "Is Fibonacci calculation a classic example of 'Optimal Substructure'?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Yes, because the solution to F(n) is directly composed of the optimal solutions to F(n-1) and F(n-2)."
      },
      {
        question: "Which real-world field uses Dynamic Programming extensively?",
        options: ["Bioinformatics (DNA sequencing)", "Financial modeling", "Resource allocation", "All of the above"],
        correctAnswer: 3,
        explanation: "DP is a powerful tool used across many fields for optimization and sequence analysis."
      },
      {
        question: "What is the 'Top-Down' approach also known as?",
        options: ["Tabulation", "Memoization", "Iteration", "Recursion without cache"],
        correctAnswer: 1,
        explanation: "Top-down DP is synonymous with memoization, as it starts with the large problem and breaks it down."
      }
    ]
  },
  'n-queens': {
    title: 'N-Queens (Backtracking)',
    description: 'The problem of placing N chess queens on an N×N chessboard so that no two queens threaten each other.',
    timeComplexity: { best: 'O(N!)', average: 'O(N!)', worst: 'O(N!)' },
    spaceComplexity: 'O(N²)',
    pseudocode: `procedure solve(row):
    if row == N: return true
    for col from 0 to N-1:
        if isSafe(row, col):
            placeQueen(row, col)
            if solve(row + 1): return true
            removeQueen(row, col)
    return false`,
    industryUse: 'Backtracking is used in constraint satisfaction problems, puzzle solving (Sudoku), and circuit design.',
    detailedExplanation: `### How it Works
The N-Queens problem is the challenge of placing $N$ chess queens on an $N \times N$ chessboard so that no two queens threaten each other. This means no two queens can share the same row, column, or diagonal.

### Backtracking Strategy
Backtracking is an algorithmic technique that considers searching in every possible combination for solving a computational problem. It is known for solving problems recursively one step at a time and removing those solutions that fail to satisfy the constraints of the problem at any point in time.

### Step-by-Step Breakdown
1. Start in the leftmost column.
2. If all queens are placed, return true.
3. Try all rows in the current column. For every tried row:
    a. If the queen can be placed safely in this row, then mark this [row, column] as part of the solution and recursively check if placing queen here leads to a solution.
    b. If placing the queen in [row, column] leads to a solution, then return true.
    c. If placing queen doesn't lead to a solution, then unmark this [row, column] (Backtrack) and go to step (a) to try other rows.
4. If all rows have been tried and nothing worked, return false to trigger backtracking in the previous column.
`,
    difficulty: 'Hard',
    optimizedCode: `function solveNQueens(n) {
  const result = [];
  const board = Array.from({ length: n }, () => Array(n).fill('.'));
  function backtrack(row) {
    if (row === n) {
      result.push(board.map(r => r.join('')));
      return;
    }
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row][col] = 'Q';
        backtrack(row + 1);
        board[row][col] = '.';
      }
    }
  }
  // isSafe implementation...
  backtrack(0);
  return result;
}`,
    quiz: [
      {
        question: "What is the core technique used in the N-Queens problem?",
        options: ["Greedy Algorithm", "Divide and Conquer", "Backtracking", "Breadth-First Search"],
        correctAnswer: 2,
        explanation: "Backtracking is used to explore all possible placements and 'backtrack' when a conflict is detected."
      },
      {
        question: "What is the time complexity of the N-Queens problem?",
        options: ["O(n)", "O(n²)", "O(n!)", "O(2^n)"],
        correctAnswer: 2,
        explanation: "The N-Queens problem has a factorial time complexity O(n!) as we try to place a queen in each row while considering previous placements."
      },
      {
        question: "What is the main constraint of the N-Queens problem?",
        options: ["Queens must be in the same row", "No two queens can threaten each other", "Queens must be placed randomly", "Only 4 queens can be used"],
        correctAnswer: 1,
        explanation: "The goal is to place N queens such that no two share the same row, column, or diagonal."
      },
      {
        question: "In the N-Queens backtracking algorithm, what does 'isSafe' check?",
        options: ["If the board is full", "If a queen can be placed at [row, col] without being attacked", "If the game is over", "If the queen is at the root"],
        correctAnswer: 1,
        explanation: "isSafe verifies that no other queen exists in the same column or diagonals."
      },
      {
        question: "Why is the time complexity O(n!)?",
        options: ["Because of nested loops", "Because we have n choices for the first row, n-1 for the second, and so on", "Because it's a binary search", "It's actually O(n)"],
        correctAnswer: 1,
        explanation: "Each row reduces the available safe columns for the next row, leading to a factorial-like search space."
      },
      {
        question: "What is the space complexity of the N-Queens solution (storing the board)?",
        options: ["O(1)", "O(n)", "O(n²)", "O(log n)"],
        correctAnswer: 2,
        explanation: "An n x n board requires O(n²) space."
      },
      {
        question: "What is 'Pruning' in the context of N-Queens?",
        options: ["Deleting the board", "Stopping a branch of search as soon as a conflict is found", "Adding more queens", "Sorting the rows"],
        correctAnswer: 1,
        explanation: "Pruning avoids exploring branches that are guaranteed to fail, significantly improving performance."
      },
      {
        question: "How many solutions exist for the standard 8-Queens problem?",
        options: ["1", "12", "92", "724"],
        correctAnswer: 2,
        explanation: "There are 92 distinct ways to place 8 queens on an 8x8 board safely."
      },
      {
        question: "Can N-Queens be solved for N=2 or N=3?",
        options: ["Yes", "No"],
        correctAnswer: 1,
        explanation: "There are no solutions for a 2x2 or 3x3 board where queens don't threaten each other."
      },
      {
        question: "Which algorithmic paradigm does N-Queens belong to?",
        options: ["Dynamic Programming", "Greedy", "Constraint Satisfaction / Backtracking", "Divide and Conquer"],
        correctAnswer: 2,
        explanation: "It is a classic example of a constraint satisfaction problem solved via backtracking."
      }
    ]
  },
  'bfs': {
    title: 'Breadth First Search (BFS)',
    description: 'Explores all neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.',
    timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
    spaceComplexity: 'O(V)',
    pseudocode: `procedure BFS(G, start_node):
    let Q be a queue
    label start_node as visited
    Q.enqueue(start_node)
    while Q is not empty:
        v := Q.dequeue()
        for all edges from v to w in G.adjacentEdges(v):
            if w is not labeled as visited:
                label w as visited
                Q.enqueue(w)`,
    industryUse: 'Used in networking to find neighbor nodes, social media for "friend suggestions", and GPS for shortest paths in unweighted graphs.',
    detailedExplanation: `### How it Works
Breadth-First Search (BFS) is an algorithm for traversing or searching tree or graph data structures. It starts at the tree root (or some arbitrary node of a graph) and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.

### Key Characteristics
- **Queue-based**: Uses a FIFO (First-In-First-Out) queue to keep track of nodes to visit.
- **Shortest Path**: In an unweighted graph, BFS is guaranteed to find the shortest path between two nodes.
- **Layer-by-Layer**: It visits nodes in "layers" or "levels" based on their distance from the start node.

### Step-by-Step Breakdown
1. Put the starting node into a queue and mark it as visited.
2. While the queue is not empty:
   a. Dequeue a node from the front of the queue.
   b. For each unvisited neighbor of the dequeued node:
      i. Mark it as visited.
      ii. Enqueue it.
`,
    difficulty: 'Medium',
    optimizedCode: `function bfs(graph, startNode) {
  const visited = new Set();
  const queue = [startNode];
  visited.add(startNode);
  while (queue.length > 0) {
    const node = queue.shift();
    console.log(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
    quiz: [
      {
        question: "What is the primary traversal order of BFS?",
        options: ["Depth-first", "Level by level", "Random", "Reverse order"],
        correctAnswer: 1,
        explanation: "BFS explores all nodes at the current depth before moving to the next level."
      },
      {
        question: "Which data structure is typically used to implement BFS?",
        options: ["Stack", "Queue", "Priority Queue", "Hash Map"],
        correctAnswer: 1,
        explanation: "A Queue (FIFO) is used to keep track of nodes to visit in the order they were discovered."
      },
      {
        question: "Can BFS find the shortest path in an unweighted graph?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Yes, BFS is guaranteed to find the shortest path between two nodes in an unweighted graph because it explores level by level."
      },
      {
        question: "What is the time complexity of BFS for a graph with V vertices and E edges?",
        options: ["O(V)", "O(E)", "O(V + E)", "O(V * E)"],
        correctAnswer: 2,
        explanation: "BFS visits every vertex once and checks every edge, resulting in O(V + E) complexity."
      },
      {
        question: "What is the space complexity of BFS?",
        options: ["O(1)", "O(V)", "O(E)", "O(V * E)"],
        correctAnswer: 1,
        explanation: "In the worst case, the queue can hold all vertices of the graph, resulting in O(V) space complexity."
      },
      {
        question: "In which scenario is BFS commonly used?",
        options: ["Topological sorting", "Solving puzzles like Sudoku", "Finding neighbors in social networks", "Cycle detection in directed graphs"],
        correctAnswer: 2,
        explanation: "BFS is ideal for finding connections within a certain distance, such as 'friends of friends' in social networks."
      },
      {
        question: "Is BFS typically implemented recursively or iteratively?",
        options: ["Recursively", "Iteratively", "Both are equally common", "Neither"],
        correctAnswer: 1,
        explanation: "BFS is almost always implemented iteratively using a queue."
      },
      {
        question: "What is the purpose of marking nodes as 'visited' in BFS?",
        options: ["To save memory", "To prevent infinite loops in graphs with cycles", "To sort the nodes", "To calculate distances"],
        correctAnswer: 1,
        explanation: "Marking nodes as visited ensures that the algorithm doesn't process the same node multiple times, which is critical for graphs with cycles."
      },
      {
        question: "A level-order traversal of a binary tree is equivalent to which algorithm?",
        options: ["DFS", "BFS", "Dijkstra", "Binary Search"],
        correctAnswer: 1,
        explanation: "Level-order traversal visits nodes level by level, which is exactly how BFS operates."
      },
      {
        question: "What happens if BFS is applied to a disconnected graph?",
        options: ["It crashes", "It visits all nodes in all components", "It only visits nodes in the component containing the start node", "It enters an infinite loop"],
        correctAnswer: 2,
        explanation: "A single BFS traversal will only visit nodes that are reachable from the starting node."
      }
    ]
  },
  'dfs': {
    title: 'Depth First Search (DFS)',
    description: 'Explores as far as possible along each branch before backtracking.',
    timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
    spaceComplexity: 'O(V)',
    pseudocode: `procedure DFS(G, v):
    label v as visited
    for all directed edges from v to w in G.adjacentEdges(v) do
        if vertex w is not labeled as visited then
            DFS(G, w)`,
    industryUse: 'Used in topological sorting, cycle detection in graphs, and solving puzzles like mazes.',
    detailedExplanation: `### How it Works
Depth-First Search (DFS) is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node (selecting some arbitrary node as the root node in the case of a graph) and explores as far as possible along each branch before backtracking.

### Key Characteristics
- **Stack-based**: Uses a LIFO (Last-In-First-Out) stack (often via recursion) to keep track of nodes to visit.
- **Backtracking**: It dives deep into a branch and only comes back when it hits a "dead end" (a node with no unvisited neighbors).
- **Memory Efficient**: Generally uses less memory than BFS on deep trees, as it only needs to store the current path.

### Step-by-Step Breakdown
1. Start at the root node and mark it as visited.
2. For each unvisited neighbor of the current node:
   a. Recursively call DFS on that neighbor.
3. If a node has no unvisited neighbors, backtrack to the previous node in the path.
`,
    difficulty: 'Medium',
    optimizedCode: `function dfs(graph, node, visited = new Set()) {
  if (visited.has(node)) return;
  visited.add(node);
  console.log(node);
  for (const neighbor of graph[node]) {
    dfs(graph, neighbor, visited);
  }
}`,
    quiz: [
      {
        question: "What is the primary traversal order of DFS?",
        options: ["Level by level", "Depth-first", "Random", "Breadth-first"],
        correctAnswer: 1,
        explanation: "DFS explores as far as possible along each branch before backtracking."
      },
      {
        question: "Which data structure is typically used to implement DFS iteratively?",
        options: ["Queue", "Stack", "Priority Queue", "Linked List"],
        correctAnswer: 1,
        explanation: "A Stack (LIFO) is used to keep track of nodes to visit, mimicking the behavior of recursion."
      },
      {
        question: "What is a common application of DFS?",
        options: ["Finding the shortest path in unweighted graphs", "Topological sorting", "Level-order traversal", "Finding the minimum spanning tree"],
        correctAnswer: 1,
        explanation: "DFS is the basis for topological sorting and cycle detection in directed graphs."
      },
      {
        question: "What is the time complexity of DFS?",
        options: ["O(V)", "O(E)", "O(V + E)", "O(V * E)"],
        correctAnswer: 2,
        explanation: "Like BFS, DFS visits every vertex and edge once, resulting in O(V + E) complexity."
      },
      {
        question: "What is the space complexity of DFS?",
        options: ["O(1)", "O(V)", "O(E)", "O(log V)"],
        correctAnswer: 1,
        explanation: "In the worst case (a single path graph), the recursion stack or explicit stack can hold all V vertices."
      },
      {
        question: "Is DFS typically implemented recursively?",
        options: ["Yes, it's very natural for DFS", "No, it's always iterative", "Only for small graphs", "Only for trees"],
        correctAnswer: 0,
        explanation: "DFS is very naturally implemented using recursion, which uses the system call stack."
      },
      {
        question: "What is 'Backtracking' in the context of DFS?",
        options: ["Going forward to a new node", "Returning to a previous node when no more neighbors are unvisited", "Restarting the algorithm", "Deleting a node"],
        correctAnswer: 1,
        explanation: "Backtracking occurs when the algorithm reaches a node with no unvisited neighbors and returns to the parent node to explore other branches."
      },
      {
        question: "Can DFS be used to detect cycles in a graph?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Yes, by keeping track of nodes currently in the recursion stack, DFS can detect back-edges which indicate cycles."
      },
      {
        question: "Which tree traversal is a form of DFS?",
        options: ["Level-order", "Preorder", "Inorder", "Both B and C"],
        correctAnswer: 3,
        explanation: "Preorder, Inorder, and Postorder traversals are all depth-first strategies."
      },
      {
        question: "What are 'Discovery' and 'Finish' times in DFS?",
        options: ["The time the algorithm starts and ends", "Timestamps for when a node is first visited and when its subtree is fully explored", "The speed of the algorithm", "The time taken to find a specific node"],
        correctAnswer: 1,
        explanation: "These timestamps are used in advanced graph algorithms like finding strongly connected components."
      }
    ]
  },
  'dijkstra': {
    title: "Dijkstra's Algorithm",
    description: 'Finds the shortest path between nodes in a weighted graph.',
    timeComplexity: { best: 'O((V + E) log V)', average: 'O((V + E) log V)', worst: 'O(V²)' },
    spaceComplexity: 'O(V)',
    pseudocode: `procedure Dijkstra(G, source):
    dist[source] := 0
    for each vertex v in G:
        if v != source: dist[v] := infinity
        add v to Q
    while Q is not empty:
        u := vertex in Q with min dist[u]
        remove u from Q
        for each neighbor v of u:
            alt := dist[u] + length(u, v)
            if alt < dist[v]:
                dist[v] := alt`,
    industryUse: 'Fundamental in GPS navigation systems (Google Maps) and network routing protocols like OSPF.',
    detailedExplanation: `### How it Works
Dijkstra's algorithm finds the shortest path from a starting node to all other nodes in a weighted graph. It is a **greedy algorithm** that always chooses the "closest" unvisited node to explore next.

### Key Constraints
- **Non-negative weights**: The algorithm only works correctly if all edge weights are non-negative. For graphs with negative weights, Bellman-Ford is used instead.

### Step-by-Step Breakdown
1. Assign a distance value to every node: set it to zero for the initial node and infinity for all other nodes.
2. Mark all nodes as unvisited. Set the initial node as current.
3. For the current node, consider all of its unvisited neighbors and calculate their tentative distances through the current node. Compare the newly calculated tentative distance to the current assigned value and assign the smaller one.
4. When we are done considering all of the unvisited neighbors of the current node, mark the current node as visited. A visited node will never be checked again.
5. If the destination node has been marked visited or if the smallest tentative distance among the nodes in the unvisited set is infinity, then stop.
6. Otherwise, select the unvisited node that is marked with the smallest tentative distance, set it as the new "current node", and go back to step 3.
`,
    difficulty: 'Hard',
    optimizedCode: `// Using a simple priority queue implementation
function dijkstra(graph, startNode) {
  const distances = {};
  const pq = new PriorityQueue();
  for (let node in graph) {
    distances[node] = node === startNode ? 0 : Infinity;
    pq.enqueue(node, distances[node]);
  }
  while (!pq.isEmpty()) {
    const { element: u } = pq.dequeue();
    for (let v in graph[u]) {
      const alt = distances[u] + graph[u][v];
      if (alt < distances[v]) {
        distances[v] = alt;
        pq.enqueue(v, alt);
      }
    }
  }
  return distances;
}`,
    quiz: [
      {
        question: "What is the primary purpose of Dijkstra's algorithm?",
        options: ["Find all-pairs shortest paths", "Find shortest path from a single source", "Find minimum spanning tree", "Detect cycles in a graph"],
        correctAnswer: 1,
        explanation: "Dijkstra's is a single-source shortest path algorithm for graphs with non-negative edge weights."
      },
      {
        question: "Can Dijkstra's algorithm handle negative edge weights?",
        options: ["Yes, always", "No, it may fail", "Only if there are no negative cycles"],
        correctAnswer: 1,
        explanation: "Dijkstra's assumes that once a node is visited, its shortest distance is found. Negative weights can violate this assumption."
      },
      {
        question: "Which data structure is used to optimize Dijkstra's Algorithm?",
        options: ["Stack", "Queue", "Priority Queue (Min-Heap)", "Hash Table"],
        correctAnswer: 2,
        explanation: "A Priority Queue allows the algorithm to efficiently pick the node with the smallest tentative distance."
      },
      {
        question: "What is the time complexity of Dijkstra's using a binary heap?",
        options: ["O(V²)", "O(E log V)", "O((V + E) log V)", "O(V + E)"],
        correctAnswer: 2,
        explanation: "With a binary heap, the complexity is O((V + E) log V) because each edge might trigger a decrease-key operation."
      },
      {
        question: "Dijkstra's Algorithm is an example of which algorithmic paradigm?",
        options: ["Divide and Conquer", "Dynamic Programming", "Greedy", "Backtracking"],
        correctAnswer: 2,
        explanation: "It is greedy because it always picks the 'closest' unvisited node at each step."
      },
      {
        question: "What is 'Relaxation' in Dijkstra's Algorithm?",
        options: ["Taking a break", "Updating the distance to a neighbor if a shorter path is found", "Removing a node from the graph", "Sorting the edges"],
        correctAnswer: 1,
        explanation: "Relaxation is the process of checking if the path to node V through node U is shorter than the current known path to V."
      },
      {
        question: "Who invented Dijkstra's Algorithm?",
        options: ["Alan Turing", "Edsger W. Dijkstra", "John von Neumann", "Donald Knuth"],
        correctAnswer: 1,
        explanation: "The algorithm was conceived by computer scientist Edsger W. Dijkstra in 1956."
      },
      {
        question: "What is the initial distance assigned to the source node?",
        options: ["Infinity", "1", "0", "-1"],
        correctAnswer: 2,
        explanation: "The distance from the source to itself is initialized to 0."
      },
      {
        question: "What is the initial distance assigned to all nodes except the source?",
        options: ["0", "1", "Infinity", "Random"],
        correctAnswer: 2,
        explanation: "All other nodes are initialized with a distance of infinity until a path is discovered."
      },
      {
        question: "In which real-world application is Dijkstra's commonly used?",
        options: ["Image compression", "GPS navigation systems", "Database indexing", "Compiling code"],
        correctAnswer: 1,
        explanation: "GPS systems use Dijkstra's (or variants like A*) to find the shortest driving route between two points."
      }
    ],
    practiceQuestions: [
      {
        title: "Network Delay Time",
        description: "Calculate how long it takes for all nodes to receive a signal from a source node.",
        solutionLink: "https://leetcode.com/problems/network-delay-time/"
      }
    ],
    externalLinks: [
      {
        title: "Dijkstra's Algorithm - Brilliant",
        url: "https://brilliant.org/wiki/dijkstras-short-path-finder/"
      }
    ]
  },
  'inorder': {
    title: 'Inorder Traversal',
    description: 'Visits left subtree, root, then right subtree.',
    timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(h)',
    pseudocode: `procedure inorder(node):
    if node == null: return
    inorder(node.left)
    visit(node)
    inorder(node.right)`,
    industryUse: 'Used in Binary Search Trees to retrieve data in non-decreasing order.',
    detailedExplanation: `### How it Works
Inorder traversal is a depth-first traversal method for binary trees. It visits the nodes in the following order:
1. **Left Subtree**: Recursively traverse the left subtree.
2. **Root Node**: Visit the current node.
3. **Right Subtree**: Recursively traverse the right subtree.

### Key Characteristics
- **BST Property**: When performed on a Binary Search Tree (BST), inorder traversal visits the nodes in **sorted (ascending) order**.
- **Recursive Nature**: The algorithm naturally lends itself to recursion, although it can be implemented iteratively using a stack.

### Use Cases
- **Sorting**: Retrieving elements from a BST in sorted order.
- **Expression Trees**: Inorder traversal of an expression tree produces the infix notation of the expression.
`,
    difficulty: 'Easy',
    optimizedCode: `function inorder(node) {
  if (!node) return;
  inorder(node.left);
  console.log(node.value);
  inorder(node.right);
}`,
    quiz: [
      {
        question: "What is the traversal order for Inorder?",
        options: ["Root, Left, Right", "Left, Root, Right", "Left, Right, Root"],
        correctAnswer: 1,
        explanation: "Inorder traversal visits the left subtree, then the root, then the right subtree."
      },
      {
        question: "Which traversal of a BST results in sorted order?",
        options: ["Preorder", "Postorder", "Inorder", "Level-order"],
        correctAnswer: 2,
        explanation: "An inorder traversal (Left, Root, Right) of a BST visits nodes in ascending sorted order."
      },
      {
        question: "Is Inorder traversal a depth-first or breadth-first strategy?",
        options: ["Depth-first", "Breadth-first"],
        correctAnswer: 0,
        explanation: "Inorder is a depth-first traversal method."
      },
      {
        question: "What is the time complexity of Inorder traversal for a tree with n nodes?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 2,
        explanation: "Every node is visited exactly once, resulting in O(n) time complexity."
      },
      {
        question: "What is the space complexity of Inorder traversal?",
        options: ["O(1)", "O(n)", "O(h) where h is height", "O(log n)"],
        correctAnswer: 2,
        explanation: "The space complexity is determined by the maximum depth of the recursion stack, which is the height of the tree."
      },
      {
        question: "In an expression tree, Inorder traversal produces which notation?",
        options: ["Prefix", "Infix", "Postfix", "Reverse Polish"],
        correctAnswer: 1,
        explanation: "Inorder traversal of an expression tree yields the standard infix notation."
      },
      {
        question: "Which data structure is used for an iterative implementation of Inorder traversal?",
        options: ["Queue", "Stack", "Hash Map", "Heap"],
        correctAnswer: 1,
        explanation: "A stack is used to keep track of nodes to visit after returning from the left subtree."
      },
      {
        question: "In a BST, which node is visited first during Inorder traversal?",
        options: ["The root", "The rightmost node", "The leftmost node", "The middle node"],
        correctAnswer: 2,
        explanation: "The leftmost node (the minimum value) is visited first."
      },
      {
        question: "In a BST, which node is visited last during Inorder traversal?",
        options: ["The root", "The rightmost node", "The leftmost node", "The middle node"],
        correctAnswer: 1,
        explanation: "The rightmost node (the maximum value) is visited last."
      },
      {
        question: "Can Inorder traversal be used to validate if a tree is a BST?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Yes, by checking if the visited values are in strictly increasing order."
      }
    ],
    practiceQuestions: [
      {
        title: "Binary Tree Inorder Traversal",
        description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
        solutionLink: "https://leetcode.com/problems/binary-tree-inorder-traversal/"
      }
    ]
  },
  'preorder': {
    title: 'Preorder Traversal',
    description: 'Visits root, left subtree, then right subtree.',
    timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(h)',
    pseudocode: `procedure preorder(node):
    if node == null: return
    visit(node)
    preorder(node.left)
    preorder(node.right)`,
    industryUse: 'Used to create a copy of the tree or to evaluate prefix expressions.',
    detailedExplanation: `### How it Works
Preorder traversal is a depth-first traversal method for binary trees. It visits the nodes in the following order:
1. **Root Node**: Visit the current node first.
2. **Left Subtree**: Recursively traverse the left subtree.
3. **Right Subtree**: Recursively traverse the right subtree.

### Key Characteristics
- **Root First**: The root is always the first node visited.
- **Tree Copying**: Preorder traversal is commonly used to create a copy of a tree, as the root is processed before its children.

### Use Cases
- **Prefix Notation**: Preorder traversal of an expression tree produces the prefix (Polish) notation of the expression.
- **Serialization**: Often used as part of tree serialization algorithms.
`,
    difficulty: 'Easy',
    optimizedCode: `function preorder(node) {
  if (!node) return;
  console.log(node.value);
  preorder(node.left);
  preorder(node.right);
}`,
    quiz: [
      {
        question: "What is the traversal order for Preorder?",
        options: ["Root, Left, Right", "Left, Root, Right", "Left, Right, Root"],
        correctAnswer: 0,
        explanation: "Preorder traversal visits the root first, then the left subtree, then the right subtree."
      },
      {
        question: "Which node is always visited first in a Preorder traversal?",
        options: ["The leftmost leaf", "The root node", "The rightmost leaf", "The middle node"],
        correctAnswer: 1,
        explanation: "Preorder traversal starts by visiting the root of the current (sub)tree."
      },
      {
        question: "What is a common use case for Preorder traversal?",
        options: ["Deleting a tree", "Copying a tree", "Sorting a BST", "Finding the shortest path"],
        correctAnswer: 1,
        explanation: "Preorder is ideal for copying a tree because the parent is processed before its children."
      },
      {
        question: "In an expression tree, Preorder traversal produces which notation?",
        options: ["Infix", "Postfix", "Prefix (Polish Notation)", "Reverse Polish"],
        correctAnswer: 2,
        explanation: "Preorder traversal of an expression tree yields prefix notation."
      },
      {
        question: "What is the time complexity of Preorder traversal?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 2,
        explanation: "Every node is visited once, resulting in O(n) complexity."
      },
      {
        question: "What is the space complexity of Preorder traversal?",
        options: ["O(1)", "O(n)", "O(h) where h is height", "O(log n)"],
        correctAnswer: 2,
        explanation: "The space complexity depends on the recursion depth, which is the tree's height."
      },
      {
        question: "Is Preorder traversal a form of DFS?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Yes, Preorder is one of the three standard depth-first traversal methods."
      },
      {
        question: "Which data structure is used for an iterative implementation of Preorder traversal?",
        options: ["Queue", "Stack", "Hash Map", "Heap"],
        correctAnswer: 1,
        explanation: "A stack is used to store children nodes to visit after the root."
      },
      {
        question: "In a serialized tree string, which traversal is often used as the primary order?",
        options: ["Preorder", "Inorder", "Postorder", "Level-order"],
        correctAnswer: 0,
        explanation: "Preorder is frequently used for serialization because it records the root before its subtrees."
      },
      {
        question: "In Preorder traversal, when is the right child visited?",
        options: ["Before the root", "Before the left child", "After the left subtree is fully explored", "Never"],
        correctAnswer: 2,
        explanation: "The order is Root -> Left Subtree -> Right Subtree."
      }
    ],
    practiceQuestions: [
      {
        title: "Binary Tree Preorder Traversal",
        description: "Given the root of a binary tree, return the preorder traversal of its nodes' values.",
        solutionLink: "https://leetcode.com/problems/binary-tree-preorder-traversal/"
      }
    ]
  },
  'postorder': {
    title: 'Postorder Traversal',
    description: 'Visits left subtree, right subtree, then root.',
    timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(h)',
    pseudocode: `procedure postorder(node):
    if node == null: return
    postorder(node.left)
    postorder(node.right)
    visit(node)`,
    industryUse: 'Used to delete the tree or to evaluate postfix expressions.',
    detailedExplanation: `### How it Works
Postorder traversal is a depth-first traversal method for binary trees. It visits the nodes in the following order:
1. **Left Subtree**: Recursively traverse the left subtree.
2. **Right Subtree**: Recursively traverse the right subtree.
3. **Root Node**: Finally, visit the current node.

### Key Characteristics
- **Root Last**: The root is always the last node visited in its subtree.
- **Bottom-Up**: It processes children before their parents, making it ideal for operations that depend on child results.

### Use Cases
- **Tree Deletion**: Used to delete a tree because children must be deleted before their parents.
- **Postfix Notation**: Postorder traversal of an expression tree produces the postfix (Reverse Polish) notation of the expression.
- **Space Calculation**: Calculating the total size of a directory (summing up sizes of all sub-directories and files).
`,
    difficulty: 'Easy',
    optimizedCode: `function postorder(node) {
  if (!node) return;
  postorder(node.left);
  postorder(node.right);
  console.log(node.value);
}`,
    quiz: [
      {
        question: "What is the traversal order for Postorder?",
        options: ["Root, Left, Right", "Left, Root, Right", "Left, Right, Root"],
        correctAnswer: 2,
        explanation: "Postorder traversal visits the left subtree, then the right subtree, and finally the root."
      },
      {
        question: "Which node is always visited last in a Postorder traversal?",
        options: ["The leftmost leaf", "The root node", "The rightmost leaf", "The middle node"],
        correctAnswer: 1,
        explanation: "Postorder traversal processes all children before visiting the root of the current (sub)tree."
      },
      {
        question: "What is a common use case for Postorder traversal?",
        options: ["Copying a tree", "Deleting a tree", "Sorting a BST", "Searching for a value"],
        correctAnswer: 1,
        explanation: "Postorder is ideal for deleting a tree because children are processed (deleted) before their parents."
      },
      {
        question: "In an expression tree, Postorder traversal produces which notation?",
        options: ["Infix", "Prefix", "Postfix (Reverse Polish)", "Standard Notation"],
        correctAnswer: 2,
        explanation: "Postorder traversal of an expression tree yields postfix notation."
      },
      {
        question: "What is the time complexity of Postorder traversal?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 2,
        explanation: "Every node is visited exactly once."
      },
      {
        question: "What is the space complexity of Postorder traversal?",
        options: ["O(1)", "O(n)", "O(h) where h is height", "O(log n)"],
        correctAnswer: 2,
        explanation: "The space complexity is proportional to the height of the tree due to the recursion stack."
      },
      {
        question: "Is Postorder traversal a 'bottom-up' or 'top-down' approach?",
        options: ["Bottom-up", "Top-down"],
        correctAnswer: 0,
        explanation: "It is bottom-up because it processes leaves and subtrees before their parent nodes."
      },
      {
        question: "Which real-world task can be modeled as a Postorder traversal?",
        options: ["Calculating directory size", "Printing a document", "Finding a friend on Facebook", "Sorting a list"],
        correctAnswer: 0,
        explanation: "To find a directory's size, you must first sum the sizes of all its files and sub-directories."
      },
      {
        question: "Which data structure is used for an iterative implementation of Postorder traversal?",
        options: ["Queue", "Stack", "Hash Map", "Heap"],
        correctAnswer: 1,
        explanation: "Iterative postorder often uses one or two stacks to manage the traversal order."
      },
      {
        question: "In Postorder traversal, when is the left child visited?",
        options: ["Before the root and right child", "After the root", "After the right child", "Never"],
        correctAnswer: 0,
        explanation: "The order is Left Subtree -> Right Subtree -> Root."
      }
    ],
    practiceQuestions: [
      {
        title: "Binary Tree Postorder Traversal",
        description: "Given the root of a binary tree, return the postorder traversal of its nodes' values.",
        solutionLink: "https://leetcode.com/problems/binary-tree-postorder-traversal/"
      }
    ]
  },
  'hash-table': {
    title: 'Hash Table',
    description: 'A data structure that maps keys to values for highly efficient lookup.',
    timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    pseudocode: `procedure insert(key, value):
    index := hash(key) % size
    bucket := table[index]
    for each pair in bucket:
        if pair.key == key:
            pair.value := value
            return
    bucket.append(Pair(key, value))`,
    industryUse: 'Extremely common. Used in databases, caches (Redis), and implementing sets/dictionaries in most languages.',
    detailedExplanation: `### How it Works
A Hash Table is a data structure that implements an associative array abstract data type, a structure that can map keys to values. It uses a **hash function** to compute an index into an array of buckets or slots, from which the desired value can be found.

### Key Components
- **Hash Function**: A function that takes a key (e.g., a string) and converts it into a numerical index.
- **Buckets/Slots**: The underlying array where the values are stored.
- **Collision Resolution**: Since different keys can hash to the same index, a strategy is needed to handle these "collisions."

### Collision Resolution Strategies
1. **Chaining**: Each bucket contains a linked list of all elements that hash to that index.
2. **Open Addressing**: If a collision occurs, the algorithm searches for the next available slot in the array (e.g., Linear Probing, Quadratic Probing, Double Hashing).

### Efficiency
The efficiency of a Hash Table depends on:
- A **good hash function** that distributes keys uniformly.
- A **low load factor** (the ratio of elements to buckets). If the load factor gets too high, the table is usually resized (rehashed) to maintain O(1) performance.
`,
    difficulty: 'Medium',
    optimizedCode: `class HashTable {
  constructor(size = 50) {
    this.table = new Array(size);
  }
  _hash(key) {
    let hash = 0;
    for (let char of key) hash += char.charCodeAt(0);
    return hash % this.table.length;
  }
  set(key, value) {
    const index = this._hash(key);
    if (!this.table[index]) this.table[index] = [];
    this.table[index].push([key, value]);
  }
  get(key) {
    const index = this._hash(key);
    if (!this.table[index]) return undefined;
    for (let pair of this.table[index]) {
      if (pair[0] === key) return pair[1];
    }
    return undefined;
  }
}`,
    quiz: [
      {
        question: "What is the average time complexity for lookup in a Hash Table?",
        options: ["O(1)", "O(log n)", "O(n)"],
        correctAnswer: 0,
        explanation: "With a good hash function and proper sizing, Hash Tables provide O(1) average time for lookup, insertion, and deletion."
      },
      {
        question: "What is a 'collision' in a Hash Table?",
        options: ["When the table is full", "When two keys hash to the same index", "When the hash function returns a negative number"],
        correctAnswer: 1,
        explanation: "A collision occurs when two different keys produce the same hash value and thus map to the same bucket in the table."
      },
      {
        question: "What is the purpose of a Hash Function?",
        options: ["To sort the data", "To map a key to a specific index in an array", "To compress the data", "To encrypt the data"],
        correctAnswer: 1,
        explanation: "The hash function converts a key into a numerical index for efficient storage and retrieval."
      },
      {
        question: "What is 'Chaining' in the context of Hash Tables?",
        options: ["Linking multiple hash tables together", "Storing colliding elements in a linked list at the same index", "Encryption technique", "Sequential searching"],
        correctAnswer: 1,
        explanation: "Chaining handles collisions by allowing multiple elements to reside in the same bucket using a linked list."
      },
      {
        question: "What is 'Open Addressing'?",
        options: ["Allowing anyone to access the table", "Finding the next available slot in the array when a collision occurs", "Using a larger array", "Publicly accessible hash functions"],
        correctAnswer: 1,
        explanation: "Open addressing strategies (like linear probing) look for empty slots elsewhere in the array when a collision happens."
      },
      {
        question: "What is the 'Load Factor' of a Hash Table?",
        options: ["The speed of the hash function", "The ratio of stored elements to the total number of buckets", "The memory size of the table", "The number of collisions"],
        correctAnswer: 1,
        explanation: "Load Factor = (Number of Elements) / (Number of Buckets). A high load factor increases the chance of collisions."
      },
      {
        question: "What is the worst-case time complexity for Hash Table operations?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 2,
        explanation: "In the worst case (e.g., all keys hash to the same index), operations can degrade to O(n)."
      },
      {
        question: "Which industry tool uses Hash Tables extensively for caching?",
        options: ["Redis", "MySQL", "Git", "Docker"],
        correctAnswer: 0,
        explanation: "Redis is a high-performance key-value store that relies heavily on hash table structures."
      },
      {
        question: "What is a 'Good' hash function?",
        options: ["One that is very complex", "One that distributes keys uniformly across the table", "One that always returns 0", "One that uses a lot of memory"],
        correctAnswer: 1,
        explanation: "Uniform distribution minimizes collisions and maintains O(1) average performance."
      },
      {
        question: "What is 'Rehashing'?",
        options: ["Running the hash function twice", "Resizing the table and re-inserting all existing elements", "Deleting the table", "Changing the keys"],
        correctAnswer: 1,
        explanation: "When the load factor exceeds a threshold, the table is resized to maintain efficiency."
      }
    ]
  },
};
