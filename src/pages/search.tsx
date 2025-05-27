"use client";

import { JSX, useEffect, useRef, useState, useCallback, useMemo } from "react";
import Card from '@/components/card'; // Assuming you have a Card component

type VisualizeFn = (index: number, found: boolean, checkedIndices: number[], log: string, line?: number) => void;

// Helper function to check if an array is sorted
const isArraySorted = (arr: number[]) => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      return false;
    }
  }
  return true;
};

// Search algorithm implementations (no change needed here, they are pure functions)
const searchAlgorithms = {
  Linear: async (
    arr: number[],
    target: number,
    visualize: VisualizeFn
  ): Promise<number> => {
    let checked: number[] = [];
    visualize(-1, false, [], `Starting Linear Search for target ${target}.`, 0);
    await new Promise((r) => setTimeout(r, 800));

    for (let i = 0; i < arr.length; i++) {
      const newChecked = [...checked];
      if (i > 0) {
        newChecked.push(i - 1);
      }
      visualize(i, false, newChecked, `Checking index ${i}: value is ${arr[i]}.`, 1);
      await new Promise((r) => setTimeout(r, 800));

      if (arr[i] === target) {
        visualize(i, true, [...newChecked, i], `Target ${target} found at index ${i}!`, 2);
        return i;
      }
    }
    visualize(-1, false, [...checked, ...Array.from({length: arr.length}, (_,i) => i)], `Target ${target} not found in the array.`, 6);
    return -1;
  },

  Binary: async (
    arr: number[],
    target: number,
    visualize: VisualizeFn
  ): Promise<number> => {
    let left = 0;
    let right = arr.length - 1;
    let checked: number[] = [];

    visualize(-1, false, [], `Starting Binary Search for target ${target}.`, 0);
    await new Promise((r) => setTimeout(r, 800));

    while (left <= right) {
      visualize(-1, false, checked, `Current search range: [${left}, ${right}].`, 3);
      await new Promise((r) => setTimeout(r, 800));

      const mid = Math.floor((left + right) / 2);
      checked.push(mid);
      visualize(mid, false, [...checked], `Middle index: ${mid}. Comparing ${arr[mid]} with ${target}.`, 4);
      await new Promise((r) => setTimeout(r, 800));

      if (arr[mid] === target) {
        visualize(mid, true, [...checked], `Target ${target} found at index ${mid}!`, 5);
        return mid;
      } else if (arr[mid] < target) {
        visualize(mid, false, [...checked], `${arr[mid]} < ${target}. Discarding left half. New range: [${mid + 1}, ${right}].`, 7);
        await new Promise((r) => setTimeout(r, 800));
        left = mid + 1;
      } else {
        visualize(mid, false, [...checked], `${arr[mid]} > ${target}. Discarding right half. New range: [${left}, ${mid - 1}].`, 9);
        await new Promise((r) => setTimeout(r, 800));
        right = mid - 1;
      }
    }
    visualize(-1, false, [...checked], `Target ${target} not found in the array.`, 13);
    return -1;
  },

  Jump: async (
    arr: number[],
    target: number,
    visualize: VisualizeFn
  ): Promise<number> => {
    const n = arr.length;
    if (n === 0) {
      visualize(-1, false, [], `Array is empty. Target ${target} not found.`, 14);
      return -1;
    }
    const step = Math.floor(Math.sqrt(n));
    let prev = 0;
    let checked: number[] = [];

    visualize(-1, false, [], `Starting Jump Search for target ${target}. Block size: ${step}.`, 0);
    await new Promise((r) => setTimeout(r, 800));

    let blockEnd = 0;
    while (blockEnd < n && arr[Math.min(blockEnd, n - 1)] < target) {
      checked.push(Math.min(blockEnd, n - 1));
      visualize(Math.min(blockEnd, n - 1), false, [...checked], `Jumping to index ${Math.min(blockEnd, n - 1)}. Value is ${arr[Math.min(blockEnd, n - 1)]}.`, 5);
      await new Promise((r) => setTimeout(r, 800));
      prev = blockEnd;
      blockEnd += step;
    }

    visualize(-1, false, [...checked], `Found block where ${target} might be. Linear searching from index ${prev} to ${Math.min(blockEnd, n) - 1}.`, 8);
    await new Promise((r) => setTimeout(r, 800));

    for (let i = prev; i < Math.min(blockEnd, n); i++) {
      checked.push(i);
      visualize(i, false, [...checked], `Linearly checking index ${i}: value is ${arr[i]}.`, 9);
      await new Promise((r) => setTimeout(r, 800));
      if (arr[i] === target) {
        visualize(i, true, [...checked], `Target ${target} found at index ${i}!`, 10);
        return i;
      }
    }
    visualize(-1, false, [...checked], `Target ${target} not found in the array.`, 14);
    return -1;
  },
};

// Descriptions for each algorithm
const algorithmDescriptions = {
  Linear: {
    name: "Linear Search",
    description: "Linear Search (also known as sequential search) checks each element in the list sequentially until a match is found or the whole list has been searched. It is simple to implement and works on unsorted arrays.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  Binary: {
    name: "Binary Search",
    description: "Binary Search efficiently finds the position of a target value within a **sorted** array. It repeatedly divides the search interval in half. This is much faster than linear search for large datasets.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
  },
  Jump: {
    name: "Jump Search",
    description: "Jump Search is an algorithm for searching a **sorted** array. It works by checking fewer elements than linear search by 'jumping' ahead by fixed steps (often the square root of array size), then performing a linear search within a smaller block.",
    timeComplexity: "O(√n)",
    spaceComplexity: "O(1)",
  },
};

// Code snippets for each algorithm to display
const searchCodeMap: Record<keyof typeof searchAlgorithms, string[]> = {
  Linear: [
    "function linearSearch(arr, target) {",
    "  for (let i = 0; i < arr.length; i++) {",
    "    if (arr[i] === target) {",
    "      return i; // Target found",
    "    }",
    "  }",
    "  return -1; // Target not found",
    "}"
  ],
  Binary: [
    "function binarySearch(arr, target) {",
    "  let left = 0;",
    "  let right = arr.length - 1;",
    "  while (left <= right) {",
    "    let mid = Math.floor((left + right) / 2);",
    "    if (arr[mid] === target) {",
    "      return mid;",
    "    } else if (arr[mid] < target) {",
    "      left = mid + 1;",
    "    } else {",
    "      right = mid - 1;",
    "    }",
    "  }",
    "  return -1;",
    "}"
  ],
  Jump: [
    "function jumpSearch(arr, target) {",
    "  const n = arr.length;",
    "  const step = Math.floor(Math.sqrt(n));",
    "  let prev = 0;",
    "  let curr = 0;",
    "  while (curr < n && arr[Math.min(curr, n - 1)] < target) {",
    "    prev = curr;",
    "    curr += step;",
    "  }",
    "  for (let i = prev; i < Math.min(curr, n); i++) {",
    "    if (arr[i] === target) {",
    "      return i;",
    "    }",
    "  }",
    "  return -1;",
    "}"
  ],
};

export default function SearchingVisualizer(): JSX.Element {
  type AlgoName = keyof typeof searchAlgorithms;

  // State for array and algorithm selection
  const [array, setArray] = useState<number[]>([2, 5, 8, 12, 23, 27, 31, 39]);
  const [selectedAlgo, setSelectedAlgo] = useState<AlgoName>("Linear");
  const [target, setTarget] = useState<number>(23);
  const [inputValue, setInputValue] = useState(array.join(", "));
  const [targetInput, setTargetInput] = useState(target.toString());
  const [isSearching, setIsSearching] = useState(false);
  const [needsSorting, setNeedsSorting] = useState(false);
  const [showTargetError, setShowTargetError] = useState(false); // State to control target error UI

  // State for visualization
  const [currentIdx, setCurrentIdx] = useState<number>(-1);
  const [foundIndex, setFoundIndex] = useState<number>(-1);
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);

  // State for thought process log and code highlighting
  const [thoughtLog, setThoughtLog] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState<number>(-1);

  // Ref for auto-scrolling the thought log
  const logRef = useRef<HTMLDivElement>(null);

  // Constants for array generation and limits
  const MAX_ARRAY_LENGTH = 15;
  const MAX_BAR_VALUE = 99;

  // Resets all visualization-related states - wrapped in useCallback
  const resetVisualState = useCallback(() => {
    setCurrentIdx(-1);
    setFoundIndex(-1);
    setCheckedIndices([]);
    setCurrentLine(-1);
    setThoughtLog([]);
    setShowTargetError(false);
  }, []); // Empty dependency array as it doesn't depend on any props or state from its closure

  // Effect hook to manage sorting requirements based on selected algorithm and array state
  useEffect(() => {
    const requiresSorted = selectedAlgo === "Binary" || selectedAlgo === "Jump";
    const currentArrayIsSorted = isArraySorted(array);

    let newThoughtLog: string[] = [];
    if (requiresSorted && !currentArrayIsSorted) {
      setNeedsSorting(true);
      newThoughtLog.push(`This algorithm (${selectedAlgo}) requires a **sorted** array. Please sort the input array first.`);
    } else {
      setNeedsSorting(false);
      if (requiresSorted && currentArrayIsSorted) {
           newThoughtLog.push(`Array is sorted. Ready for ${selectedAlgo} search.`);
      } else if (!requiresSorted && selectedAlgo === "Linear") {
          newThoughtLog.push(`Algorithm changed to ${selectedAlgo}.`);
      }
    }
    // Only update thoughtLog if there's new content or a significant change
    setThoughtLog(prev => {
        const filteredPrev = prev.filter(log => !log.includes("This algorithm (") && !log.includes("Array is unsorted") && !log.includes("Algorithm changed to Linear."));
        // Prevent duplicate messages if the state hasn't fundamentally changed
        if (newThoughtLog.length > 0 && !filteredPrev.includes(newThoughtLog[0])) {
            return [...filteredPrev, ...newThoughtLog];
        }
        return filteredPrev.length === 0 && newThoughtLog.length > 0 ? newThoughtLog : prev;
    });
    resetVisualState();
  }, [selectedAlgo, array, resetVisualState]); // Added resetVisualState to dependencies

  // Callback function passed to search algorithms for visualization updates
  const visualize: VisualizeFn = useCallback((index, found, checked, log, line = -1) => {
    setCurrentIdx(index);
    setFoundIndex(found ? index : -1);
    setCheckedIndices(checked);
    setThoughtLog((prev) => [...prev, log]);
    setCurrentLine(line);
  }, []); // Empty dependency array as it only uses setState functions which are stable

  // Handles the primary action button (Search or Sort Array) - wrapped in useCallback
  const handlePrimaryActionButton = useCallback(async () => {
    const isTargetValid = targetInput.trim() !== "" && !isNaN(Number(targetInput));

    if (!isTargetValid && !needsSorting) {
      setShowTargetError(true);
      setThoughtLog((prev) => [...prev, "Error: Target value is required to perform a search."]);
      return;
    }

    if (needsSorting && (selectedAlgo === "Binary" || selectedAlgo === "Jump")) {
      handleSortArray();
    } else {
      setShowTargetError(false);
      await handleSearch();
    }
  }, [targetInput, needsSorting, selectedAlgo]); // Dependencies: targetInput, needsSorting, selectedAlgo

  // Initiates the search process - wrapped in useCallback
  const handleSearch = useCallback(async () => {
    setIsSearching(true);
    resetVisualState();
    setThoughtLog([`Starting ${selectedAlgo} search for target ${target}...`]);

    const idx = await searchAlgorithms[selectedAlgo](
      array,
      target,
      visualize
    );
    setFoundIndex(idx);
    setIsSearching(false);
    setCurrentIdx(-1);
    setCurrentLine(-1);

    if (idx === -1) {
        setThoughtLog((prev) => [...prev, `Search complete: Target ${target} was not found.`]);
    } else {
        setThoughtLog((prev) => [...prev, `Search complete: Target ${target} found at final index ${idx}.`]);
    }
  }, [array, target, selectedAlgo, visualize, resetVisualState]); // Dependencies: array, target, selectedAlgo, visualize, resetVisualState

  // Handles changes to the array input field - wrapped in useCallback
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9,]/g, "");
    setInputValue(value);
    let newArray = value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
      .map(Number)
      .slice(0, MAX_ARRAY_LENGTH);

    setArray(newArray);
    setThoughtLog(newArray.length > 0 ? ["New array entered. Check algorithm requirements or click action button."] : ["Array cleared."]);
    resetVisualState();
  }, [resetVisualState]); // Dependency: resetVisualState

  // Handles changes to the target input field - wrapped in useCallback
  const handleTargetChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setTargetInput(value);
    if (value) {
      setTarget(Number(value));
      setThoughtLog([`Target value set to ${value}.`]);
      setShowTargetError(false);
    } else {
      setTarget(0);
      setThoughtLog(["Target value cleared."]);
      setShowTargetError(true);
    }
    resetVisualState();
  }, [resetVisualState]); // Dependency: resetVisualState

  // Generates a random array - wrapped in useCallback
  const generateRandomArray = useCallback(() => {
    const randomLength = 5 + Math.floor(Math.random() * (MAX_ARRAY_LENGTH - 5 + 1));
    let randomArray = Array.from({ length: randomLength }, () =>
      Math.floor(Math.random() * MAX_BAR_VALUE) + 1
    );

    setArray(randomArray);
    setInputValue(randomArray.join(", "));
    setThoughtLog(["Generated a random array. Check algorithm requirements or click action button."]);
    resetVisualState();
  }, [resetVisualState]); // Dependency: resetVisualState

  // Sorts the current array - wrapped in useCallback
  const handleSortArray = useCallback(() => {
    const sortedArray = [...array].sort((a, b) => a - b);
    setArray(sortedArray);
    setInputValue(sortedArray.join(", "));
    setThoughtLog(["Array sorted! Now you can perform Binary or Jump Search."]);
    resetVisualState();
  }, [array, resetVisualState]); // Dependencies: array, resetVisualState

  // Scrolls thought log to the bottom
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [thoughtLog]);

  // Derived states for UI logic - useMemo for performance
  const currentAlgorithmInfo = useMemo(() => algorithmDescriptions[selectedAlgo], [selectedAlgo]);
  const currentAlgorithmCode = useMemo(() => searchCodeMap[selectedAlgo], [selectedAlgo]);

  const isSortedSearchAlgo = useMemo(() => selectedAlgo === "Binary" || selectedAlgo === "Jump", [selectedAlgo]);
  const currentArrayIsSorted = useMemo(() => isArraySorted(array), [array]); // Memoize this check
  const showSortAction = useMemo(() => isSortedSearchAlgo && !currentArrayIsSorted, [isSortedSearchAlgo, currentArrayIsSorted]);
  const isTargetValid = useMemo(() => targetInput.trim() !== "" && !isNaN(Number(targetInput)), [targetInput]);

  const buttonText = useMemo(() => showSortAction ? "Sort Array" : (isSearching ? "Searching..." : "Search"), [showSortAction, isSearching]);
  const buttonColorClass = useMemo(() => showSortAction ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700", [showSortAction]);
  const isDisabled = useMemo(() => isSearching || array.length === 0 || (!showSortAction && !isTargetValid), [isSearching, array.length, showSortAction, isTargetValid]);

  return (
    <div className="text-gray-800 dark:text-gray-200 flex flex-col items-center justify-start py-8 px-4 sm:px-6">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-center tracking-wide">
        Searching Algorithm Visualizer
      </h1>

      {/* Control Panel: Array Input, Random Button, Target Input, Algo Select, Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-5xl mx-auto mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="flex-grow w-full sm:w-auto p-2 rounded-md border border-gray-300 dark:border-gray-700 focus:ring-1 focus:ring-indigo-300 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
          placeholder={`Enter numbers (max ${MAX_ARRAY_LENGTH})`}
          disabled={isSearching}
        />
        <button
          onClick={generateRandomArray}
          className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-3 rounded-md disabled:opacity-50 text-sm"
          disabled={isSearching}
        >
          Random
        </button>
        {/* Target input with conditional red border and tooltip */}
        <div className="relative w-full sm:w-auto">
          <input
              type="text"
              value={targetInput}
              onChange={handleTargetChange}
              className={`w-full p-2 rounded-md border ${showTargetError ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} focus:ring-1 focus:ring-indigo-300 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm`}
              placeholder="Target value (e.g., 23)"
              disabled={isSearching}
            />
            {showTargetError && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-red-500 text-white text-xs rounded-md shadow-lg whitespace-nowrap z-10">
                <span className="italic">Target Required</span>
              </div>
            )}
        </div>
        <select
          value={selectedAlgo}
          onChange={(e) => setSelectedAlgo(e.target.value as AlgoName)}
          className="w-full sm:w-auto p-2 rounded-md border border-gray-300 dark:border-gray-700 focus:ring-1 focus:ring-indigo-300 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
          disabled={isSearching}
        >
          {Object.keys(searchAlgorithms).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <button
          onClick={handlePrimaryActionButton}
          disabled={isDisabled}
          className={`
            w-full sm:w-auto px-4 py-2 rounded-md text-white font-medium disabled:opacity-50 text-sm
            ${isDisabled ? "bg-gray-400 cursor-not-allowed" : buttonColorClass}
            flex-shrink-0
            min-w-[120px] sm:min-w-[140px]
          `}
        >
          {buttonText}
        </button>
      </div>

      {/* Main Content Area: Algorithm Description, Code, Visualization, Thought Process */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-5xl mx-auto">

        <Card title={`${currentAlgorithmInfo.name} Algorithm Description`}>
          <p className="mb-2 leading-snug">
            {currentAlgorithmInfo.description}
          </p>
          <div className="text-xs mt-2">
            <p className="font-medium">Time Complexity: <span className="font-normal">{currentAlgorithmInfo.timeComplexity}</span></p>
            <p className="font-medium">Space Complexity: <span className="font-normal">{currentAlgorithmInfo.spaceComplexity}</span></p>
          </div>
        </Card>

        <Card title="Algorithm Code">
            <div className="flex-grow overflow-y-auto text-xs leading-snug">
                {currentAlgorithmCode.map((line, idx) => (
                    <pre
                        key={idx}
                        className={`transition-all duration-200 whitespace-pre-wrap
                            ${idx === currentLine ? "bg-yellow-200 dark:bg-yellow-700 text-black dark:text-white font-semibold" : ""}
                        `}
                    >
                        {line}
                    </pre>
                ))}
            </div>
        </Card>

        {/* Array Visualization Card */}
        <Card
          title="Array Visualization"
          height="h-[230px]" // Fixed height for the card
          // Changed contentClassName for fixed box sizing
          contentClassName="flex flex-wrap justify-center items-center h-full w-full gap-3 px-2 overflow-x-auto"
        >
            {array.length > 0 ? (
                array.map((num, idx) => {
                const isCurrent = idx === currentIdx;
                const isFound = idx === foundIndex && foundIndex !== -1;
                const isChecked = checkedIndices.includes(idx) && !isCurrent && !isFound;

                return (
                    <div
                        key={idx}
                        className={`
                            w-16 h-16 flex-none // Fixed width and height, prevent flex growth/shrink
                            flex items-center justify-center
                            rounded-lg font-semibold text-base sm:text-lg border-2
                            transition-all duration-300 ease-in-out transform
                            cursor-default select-none
                            ${
                            isFound
                                ? "bg-green-500 border-green-400 scale-110 shadow-lg"
                                : isCurrent
                                ? "bg-yellow-500 border-yellow-400 scale-105 shadow"
                                : isChecked
                                ? "bg-blue-500 border-blue-400 opacity-80"
                                : "bg-indigo-500 border-indigo-400"
                            }
                        `}
                    >
                    <span className="text-white text-xs sm:text-base md:text-lg overflow-hidden text-ellipsis px-1">{num}</span>
                    </div>
                );
                })
            ) : (
                <p className="italic text-gray-500 text-center w-full">Enter numbers or generate a random array.</p>
            )}
        </Card>

        {/* Thought Process Log Card */}
        <Card title="Thought Process" height="h-[230px]" ref={logRef} contentClassName="text-xs">
          {thoughtLog.length === 0 ? (
            <p className="italic text-gray-500">Algorithm steps will appear here...</p>
          ) : (
            thoughtLog.map((log, i) => (
              <p
                key={i}
                className={`mb-1 ${log.includes('found at index') ? 'text-green-600 font-bold' : log.includes('not found') ? 'text-red-600 font-bold' : log.includes('requires a **sorted** array') ? 'text-red-500 font-bold' : ''}`}
              >
                {log}
              </p>
            ))
          )}
        </Card>
      </div>

      {/* Search Status Display */}
      <div className="mt-6 w-full max-w-5xl text-center">
        <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Search Status:{" "}
          {isSearching ? (
            <span className="text-yellow-500">Searching...</span>
          ) : showSortAction ? (
            <span className="text-red-500 italic">Array not sorted, sort array</span>
          ) : foundIndex !== -1 ? (
            <span className="text-green-500">Target {target} found at index {foundIndex}!</span>
          ) : checkedIndices.length > 0 && array.length > 0 ? (
            <span className="text-red-500">Target {target} not found.</span>
          ) : (
            <span className="italic text-gray-500">Ready to search.</span>
          )}
        </p>
      </div>
    </div>
  );
}