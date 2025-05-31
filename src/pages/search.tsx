"use client";

import { JSX, useEffect, useRef, useState, useCallback, useMemo } from "react";
import Card from '@/components/card';

type VisualizeFn = (
  index: number,
  found: boolean,
  checkedIndices: number[],
  log: string,
  line?: number
) => void;

type SearchAlgorithmFn = (
  arr: number[],
  target: number,
  visualize: VisualizeFn
) => Promise<number>;

const isArraySorted = (arr: number[]): boolean => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      return false;
    }
  }
  return true;
};

const searchAlgorithms: Record<string, SearchAlgorithmFn> = {
  Linear: async (
    arr,
    target,
    visualize
  ): Promise<number> => {
    visualize(-1, false, [], `Starting Linear Search for target ${target}.`, 0);
    await new Promise((r) => setTimeout(r, 800));

    for (let i = 0; i < arr.length; i++) {
      // Highlight only the current index being checked
      const currentChecked: number[] = [i];
      visualize(i, false, currentChecked, `Checking index ${i}: value is ${arr[i]}.`, 1);
      await new Promise((r) => setTimeout(r, 800));

      if (arr[i] === target) {
        visualize(i, true, [i], `Target ${target} found at index ${i}!`, 2);
        return i;
      }
    }
    // Target not found, visualize all elements as checked
    visualize(-1, false, Array.from({ length: arr.length }, (_, idx) => idx), `Target ${target} not found in the array.`, 6);
    return -1;
  },

  Binary: async (
    arr,
    target,
    visualize
  ): Promise<number> => {
    let left = 0;
    let right = arr.length - 1;
    const pathCheckedIndices: number[] = [];

    visualize(-1, false, [], `Starting Binary Search for target ${target}.`, 0);
    await new Promise((r) => setTimeout(r, 800));

    while (left <= right) {
      visualize(-1, false, pathCheckedIndices, `Current search range: [${left}, ${right}].`, 3);
      await new Promise((r) => setTimeout(r, 800));

      const mid = Math.floor((left + right) / 2);
      pathCheckedIndices.push(mid);

      visualize(mid, false, [mid], `Middle index: ${mid}. Comparing ${arr[mid]} with ${target}.`, 4);
      await new Promise((r) => setTimeout(r, 800));

      if (arr[mid] === target) {
        visualize(mid, true, [mid], `Target ${target} found at index ${mid}!`, 5);
        return mid;
      } else if (arr[mid] < target) {
        visualize(mid, false, [mid], `${arr[mid]} < ${target}. Discarding left half. New range: [${mid + 1}, ${right}].`, 7);
        await new Promise((r) => setTimeout(r, 800));
        left = mid + 1;
      } else {
        visualize(mid, false, [mid], `${arr[mid]} > ${target}. Discarding right half. New range: [${left}, ${mid - 1}].`, 9);
        await new Promise((r) => setTimeout(r, 800));
        right = mid - 1;
      }
    }
    visualize(-1, false, pathCheckedIndices, `Target ${target} not found in the array.`, 13);
    return -1;
  },

  Jump: async (
    arr,
    target,
    visualize
  ): Promise<number> => {
    const n = arr.length;
    if (n === 0) {
      visualize(-1, false, [], `Array is empty. Target ${target} not found.`, 14);
      return -1;
    }
    const step = Math.floor(Math.sqrt(n));
    let prev = 0;
    let currentBlockEnd = 0; // Represents the end of the current block
    const jumpPathIndices: number[] = []; // Collects indices of block jumps

    visualize(-1, false, [], `Starting Jump Search for target ${target}. Block size: ${step}.`, 0);
    await new Promise((r) => setTimeout(r, 800));

    // Phase 1: Jumping through blocks
    // This loop finds the first block where arr[currentBlockEnd] is >= target
    while (currentBlockEnd < n && arr[Math.min(currentBlockEnd, n - 1)] < target) {
      const currentJumpIndex = Math.min(currentBlockEnd, n - 1);
      jumpPathIndices.push(currentJumpIndex); // Add to the path of jumps

      visualize(
        currentJumpIndex,
        false,
        [currentJumpIndex], // Only highlight the current jump point
        `Jumping to index ${currentJumpIndex}. Value is ${arr[currentJumpIndex]}.`,
        5
      );
      await new Promise((r) => setTimeout(r, 800));
      prev = currentBlockEnd;
      currentBlockEnd += step;
    }

    // Determine the actual upper limit for the linear search
    // This limit should be the first element that was >= target
    // or the end of the array if currentBlockEnd went past it.
    // The linear search should go from `prev` up to `Math.min(currentBlockEnd, n - 1)` (inclusive)
    const linearSearchUpperLimit = Math.min(currentBlockEnd, n - 1); // Corrected upper limit for linear scan (inclusive)

    visualize(-1, false, jumpPathIndices, `Found block where ${target} might be. Linear searching from index ${prev} to ${linearSearchUpperLimit}.`, 8);
    await new Promise((r) => setTimeout(r, 800));

    // Phase 2: Linear search within the identified block
    // The loop now correctly includes the element at linearSearchUpperLimit
    for (let i = prev; i <= linearSearchUpperLimit; i++) { // Changed condition to <= linearSearchUpperLimit
      visualize(i, false, [i], `Linearly checking index ${i}: value is ${arr[i]}.`, 9); // Highlight only the current linear check
      await new Promise((r) => setTimeout(r, 800));
      if (arr[i] === target) {
        visualize(i, true, [i], `Target ${target} found at index ${i}!`, 10);
        return i;
      }
    }

    visualize(-1, false, [], `Target ${target} not found in the array.`, 14);
    return -1;
  },
};

interface AlgorithmDescription {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
}

const algorithmDescriptions: Record<keyof typeof searchAlgorithms, AlgorithmDescription> = {
  Linear: {
    name: "Linear Search",
    description: "Linear Search (also known as sequential search) checks each element in the list sequentially until a match is found or the whole list has been searched. It is simple to implement and works on unsorted arrays.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  Binary: {
    name: "Binary Search",
    description: "Binary Search efficiently finds the position of a target value within a sorted array. It repeatedly divides the search interval in half. This is much faster than linear search for large datasets.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
  },
  Jump: {
    name: "Jump Search",
    description: "Jump Search is an algorithm for searching a sorted array. It works by checking fewer elements than linear search by 'jumping' ahead by fixed steps (often the square root of array size), then performing a linear search within a smaller block.",
    timeComplexity: "O(√n)",
    spaceComplexity: "O(1)",
  },
};

const searchCodeMap: Record<keyof typeof searchAlgorithms, string[]> = {
  Linear: [
    "function linearSearch(arr, target) {",
    "  for (let i = 0; i < arr.length; i++) {",
    "    if (arr[i] === target) {",
    "      return i; // Target found",
    "    }",
    "  }",
    "  return -1;",
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
    "  // Linear search in the identified block",
    "  for (let i = prev; i <= Math.min(curr, n - 1); i++) {",
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

  const [array, setArray] = useState<number[]>([2, 5, 8, 12, 23, 27, 31, 39]);
  const [selectedAlgo, setSelectedAlgo] = useState<AlgoName>("Linear");
  const [target, setTarget] = useState<number>(23);
  const [inputValue, setInputValue] = useState<string>(array.join(", "));
  const [targetInput, setTargetInput] = useState<string>(target.toString());
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [needsSorting, setNeedsSorting] = useState<boolean>(false);
  const [showTargetError, setShowTargetError] = useState<boolean>(false);
  const [currentIdx, setCurrentIdx] = useState<number>(-1);
  const [foundIndex, setFoundIndex] = useState<number>(-1);
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);
  const [thoughtLog, setThoughtLog] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState<number>(-1);
  const logRef = useRef<HTMLDivElement>(null);

  const MAX_ARRAY_LENGTH: number = 15;
  const MAX_BAR_VALUE: number = 99;

  const resetVisualState = useCallback((): void => {
    setCurrentIdx(-1);
    setFoundIndex(-1);
    setCheckedIndices([]);
    setCurrentLine(-1);
  }, []);

  useEffect(() => {
    const requiresSorted: boolean = selectedAlgo === "Binary" || selectedAlgo === "Jump";
    const currentArrayIsSorted: boolean = isArraySorted(array);

    const newThoughtLogMessages: string[] = [];
    if (requiresSorted && !currentArrayIsSorted) {
      setNeedsSorting(true);
      newThoughtLogMessages.push(`This algorithm (${selectedAlgo}) requires a <b>sorted</b> array. Please sort the input array first.`);
    } else {
      setNeedsSorting(false);
      if (requiresSorted && currentArrayIsSorted) {
           newThoughtLogMessages.push(`Array is sorted. Ready for ${selectedAlgo} search.`);
      } else if (!requiresSorted && selectedAlgo === "Linear") {
          newThoughtLogMessages.push(`Algorithm changed to ${selectedAlgo}.`);
      }
    }

    setThoughtLog(prev => {
        const filteredPrev = prev.filter(log =>
            !log.includes("This algorithm (") &&
            !log.includes("Array is unsorted") &&
            !log.includes("Algorithm changed to Linear.") &&
            !log.includes("Array is sorted. Ready for")
        );
        newThoughtLogMessages.forEach(msg => {
            if (!filteredPrev.includes(msg)) {
                filteredPrev.push(msg);
            }
        });
        return filteredPrev;
    });
    resetVisualState();
  }, [selectedAlgo, array, resetVisualState]);

  const visualize: VisualizeFn = useCallback((index, found, checked, log, line = -1): void => {
    setCurrentIdx(index);
    setFoundIndex(found ? index : -1);
    setCheckedIndices(checked);
    setThoughtLog((prev) => [...prev, log]);
    setCurrentLine(line);
  }, []); // Dependencies are stable (setters, primitives), so empty array is fine

  const handleSearch = useCallback(async (): Promise<void> => {
    setIsSearching(true);
    resetVisualState();
    setThoughtLog([`Starting ${selectedAlgo} search for target ${target}...`]);

    const idx: number = await searchAlgorithms[selectedAlgo](
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
  }, [array, target, selectedAlgo, visualize, resetVisualState]);

  const handleSortArray = useCallback((): void => {
    const sortedArray: number[] = [...array].sort((a, b) => a - b);
    setArray(sortedArray);
    setInputValue(sortedArray.join(", "));
    setThoughtLog(["Array sorted! Now you can perform Binary or Jump Search."]);
    setNeedsSorting(false);
    resetVisualState();
  }, [array, resetVisualState]); // Depend on array as its value is used

  const handlePrimaryActionButton = useCallback(async (): Promise<void> => {
    const isTargetValidCheck: boolean = targetInput.trim() !== "" && !isNaN(Number(targetInput));

    if (!isTargetValidCheck && !needsSorting) {
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
  }, [targetInput, needsSorting, selectedAlgo, handleSortArray, handleSearch]); 

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value.replace(/[^0-9,]/g, "");
    setInputValue(value);
    const newArray: number[] = value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
      .map(Number)
      .slice(0, MAX_ARRAY_LENGTH);

    setArray(newArray);
    setThoughtLog(newArray.length > 0 ? ["New array entered. Check algorithm requirements or click action button."] : ["Array cleared."]);
    resetVisualState();
  }, [resetVisualState, MAX_ARRAY_LENGTH]);

  const handleTargetChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value.replace(/[^0-9]/g, "");
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
  }, [resetVisualState]);

  const generateRandomArray = useCallback((): void => {
    const randomLength: number = 5 + Math.floor(Math.random() * (MAX_ARRAY_LENGTH - 5 + 1));
    const randomArray: number[] = Array.from({ length: randomLength }, () =>
      Math.floor(Math.random() * MAX_BAR_VALUE) + 1
    );

    setArray(randomArray);
    setInputValue(randomArray.join(", "));
    setThoughtLog(["Generated a random array. Check algorithm requirements or click action button."]);
    resetVisualState();
  }, [resetVisualState, MAX_ARRAY_LENGTH, MAX_BAR_VALUE]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [thoughtLog]);

  const currentAlgorithmInfo = useMemo(() => algorithmDescriptions[selectedAlgo], [selectedAlgo]);
  const currentAlgorithmCode = useMemo(() => searchCodeMap[selectedAlgo], [selectedAlgo]);

  const isSortedSearchAlgo = useMemo(() => selectedAlgo === "Binary" || selectedAlgo === "Jump", [selectedAlgo]);
  const currentArrayIsSorted = useMemo(() => isArraySorted(array), [array]);
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
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedAlgo(e.target.value as AlgoName)}
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

        <Card
          title="Array Visualization"
          height="h-[230px]"
          contentClassName="flex flex-wrap justify-center items-center h-full w-full gap-3 px-2 overflow-x-auto"
        >
            {array.length > 0 ? (
                array.map((num, idx) => {
                const isCurrent: boolean = idx === currentIdx;
                const isFound: boolean = idx === foundIndex && foundIndex !== -1;
                const isChecked: boolean = checkedIndices.includes(idx) && !isCurrent && !isFound;

                return (
                    <div
                        key={idx}
                        className={`
                            w-16 h-16 flex-none
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

        <Card title="Thought Process" height="h-[230px]" ref={logRef} contentClassName="text-xs">
          {thoughtLog.length === 0 ? (
            <p className="italic text-gray-500">Algorithm steps will appear here...</p>
          ) : (
            thoughtLog.map((log, i) => (
              <p
                key={i}
                className={`mb-1 ${log.includes('found at index') ? 'text-green-600 font-bold' : log.includes('not found') ? 'text-red-600 font-bold' : log.includes('requires a sorted array') ? 'text-red-500 font-bold' : ''}`}
                dangerouslySetInnerHTML={{ __html: log }}
              />
            ))
          )}
        </Card>
      </div>

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