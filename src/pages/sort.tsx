"use client";
import { useState, useRef, useEffect } from "react";
import Card from '@/components/card';

type VisualizeFn = (arr: number[], i: number, j: number, log: string, line: number) => void;

const bubbleSortCode = [
  "for (let i = 0; i < a.length - 1; i++) {",
  "  for (let j = 0; j < a.length - i - 1; j++) {",
  "    if (a[j] > a[j + 1]) {",
  "      [a[j], a[j + 1]] = [a[j + 1], a[j]];",
  "    }",
  "  }",
  "}",
];

const insertionSortCode = [
  "for (let i = 1; i < a.length; i++) {",
  "  let key = a[i];",
  "  let j = i - 1;",
  "  while (j >= 0 && a[j] > key) {",
    "    a[j + 1] = a[j];",
    "    j = j - 1;",
    "  }",
    "  a[j + 1] = key;",
    "}",
];

const selectionSortCode = [
  "for (let i = 0; i < a.length; i++) {",
  "  let minIdx = i;",
  "  for (let j = i + 1; j < a.length; j++) {",
  "    if (a[j] < a[minIdx]) {",
  "      minIdx = j;",
    "    }",
    "  }",
    "  if (minIdx !== i) {",
    "    [a[i], a[minIdx]] = [a[minIdx], a[i]];",
    "  }",
    "}",
];

const sortingAlgorithms = {
  Bubble: async (arr: number[], visualize: VisualizeFn) => {
    const a = [...arr];
    for (let i = 0; i < a.length - 1; i++) {
      visualize(a, -1, -1, `Starting pass ${i + 1}`, 0);
      for (let j = 0; j < a.length - i - 1; j++) {
        visualize(a, j, j + 1, `Comparing ${a[j]} and ${a[j + 1]}...`, 1);
        await new Promise((r) => setTimeout(r, 400));
        if (a[j] > a[j + 1]) {
          visualize(a, j, j + 1, `Condition (a[${j}] > a[${j + 1}]) is TRUE. Swapping ${a[j]} and ${a[j + 1]}.`, 2);
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          await new Promise((r) => setTimeout(r, 400));
          visualize(a, j, j + 1, `Swap complete. Array: [${a.join(", ")}]`, 3);
        } else {
          visualize(a, j, j + 1, `Condition (a[${j}] > a[${j + 1}]) is FALSE. Retaining order.`, 2);
          await new Promise((r) => setTimeout(r, 400));
        }
      }
    }
    visualize(a, -1, -1, `Array is sorted!`, -1);
    return a;
  },
  Insertion: async (arr: number[], visualize: VisualizeFn) => {
    const a = [...arr];
    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;
      visualize(a, i, -2, `Considering element ${key} (at index ${i}) for insertion.`, 0);
      await new Promise((r) => setTimeout(r, 400));
      let shifted = false;
      while (j >= 0 && a[j] > key) {
        visualize(a, j, j + 1, `Value ${a[j]} (at index ${j}) is greater than key ${key}. Shifting right.`, 3);
        a[j + 1] = a[j];
        await new Promise((r) => setTimeout(r, 400));
        j = j - 1;
        shifted = true;
      }
      a[j + 1] = key;
      visualize(a, j + 1, -2, shifted ? `Key ${key} inserted at position ${j + 1}. Array: [${a.join(", ")}]` : `No elements shifted. ${key} remains at index ${i}. Array: [${a.join(", ")}]`, 7);
      await new Promise((r) => setTimeout(r, 400));
    }
    visualize(a, -1, -1, `Array is sorted!`, -1);
    return a;
  },
  Selection: async (arr: number[], visualize: VisualizeFn) => {
    const a = [...arr];
    for (let i = 0; i < a.length; i++) {
      let minIdx = i;
      visualize(a, minIdx, -3, `Starting selection for current pass. Assuming ${a[i]} (at index ${i}) is minimum.`, 0);
      await new Promise((r) => setTimeout(r, 400));
      for (let j = i + 1; j < a.length; j++) {
        visualize(a, minIdx, j, `Comparing ${a[j]} (at index ${j}) with current minimum ${a[minIdx]} (at index ${minIdx}).`, 2);
        await new Promise((r) => setTimeout(r, 400));
        if (a[j] < a[minIdx]) {
          minIdx = j;
          visualize(a, minIdx, -3, `New minimum found: ${a[minIdx]} at index ${minIdx}.`, 4);
          await new Promise((r) => setTimeout(r, 400));
        } else {
          visualize(a, minIdx, j, `Current minimum ${a[minIdx]} is smaller or equal.`, 2);
          await new Promise((r) => setTimeout(r, 400));
        }
      }
      if (minIdx !== i) {
        visualize(a, i, minIdx, `Minimum ${a[minIdx]} found. Swapping ${a[i]} and ${a[minIdx]}.`, 6);
        [a[i], a[minIdx]] = [a[minIdx], a[i]];
        await new Promise((r) => setTimeout(r, 400));
        visualize(a, i, minIdx, `Swap complete. Array: [${a.join(", ")}]`, 6);
      } else {
        visualize(a, -1, -1, `No swap needed for index ${i} as ${a[i]} was already the minimum.`, -1);
        await new Promise((r) => setTimeout(r, 400));
      }
    }
    visualize(a, -1, -1, `Array is sorted!`, -1);
    return a;
  },
};

const codeMap = {
  Bubble: bubbleSortCode,
  Insertion: insertionSortCode,
  Selection: selectionSortCode,
};

const algorithmDescriptions = {
  Bubble: {
    name: "Bubble Sort",
    description: "Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list repeats until no swaps are needed.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
  },
  Insertion: {
    name: "Insertion Sort",
    description: "Insertion Sort builds the final sorted array one item at a time. It iterates through elements, finds their correct position in the sorted part, and inserts them.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
  },
  Selection: {
    name: "Selection Sort",
    description: "Selection Sort finds the minimum element from the unsorted part of the array and puts it at the beginning. It maintains sorted and unsorted subarrays.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
  },
};

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([5, 3, 8, 4, 1, 2, 7]);
  const [selectedAlgo, setSelectedAlgo] = useState<keyof typeof sortingAlgorithms>("Bubble");
  const [highlight, setHighlight] = useState([-1, -1]);
  const [inputValue, setInputValue] = useState(array.join(", "));
  const [isSorting, setIsSorting] = useState(false);
  const [thoughtLog, setThoughtLog] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState<number>(-1);

  const logRef = useRef<HTMLDivElement>(null); 

  const MAX_BAR_VALUE = 50; 

  const visualize: VisualizeFn = (arr, i, j, log, line) => {
    setArray([...arr]);
    setHighlight([i, j]);
    setCurrentLine(line);
    setThoughtLog((prev) => [...prev, log]);
  };

  const handleSort = async () => {
    setIsSorting(true);
    setThoughtLog([`Starting ${selectedAlgo} sort...`]);
    setCurrentLine(-1);
    await sortingAlgorithms[selectedAlgo](array, visualize);
    setHighlight([-1, -1]);
    setIsSorting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9,]/g, "");
    setInputValue(value);
    const newArray = value.split(",").filter(Boolean).map(Number);
    setArray(newArray);
    setThoughtLog(["New array entered. Click 'Visualize' to sort."]);
    setCurrentLine(-1);
  };

  const generateRandomArray = () => {
    const randomArray = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * MAX_BAR_VALUE) + 1 
    );
    setArray(randomArray);
    setInputValue(randomArray.join(", "));
    setThoughtLog(["Generated a random array. Click 'Visualize' to sort."]);
    setCurrentLine(-1);
  };

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [thoughtLog]);

  const currentAlgorithmInfo = algorithmDescriptions[selectedAlgo];

  return (
    <div className="text-gray-800 dark:text-gray-200 flex flex-col items-center justify-start py-8 px-4 sm:px-6">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-center tracking-wide">
        Sorting Algorithm Visualizer
      </h1>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-5xl mx-auto mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="flex-grow w-full sm:w-auto p-2 rounded-md border border-gray-300 dark:border-gray-700 focus:ring-1 focus:ring-indigo-300 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
          placeholder="e.g., 5, 3, 8"
          disabled={isSorting}
        />
        <button
          onClick={generateRandomArray}
          className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-3 rounded-md disabled:opacity-50 text-sm"
          disabled={isSorting}
        >
          Random
        </button>
        <select
          value={selectedAlgo}
          onChange={(e) => setSelectedAlgo(e.target.value as keyof typeof sortingAlgorithms)}
          className="w-full sm:w-auto p-2 rounded-md border border-gray-300 dark:border-gray-700 focus:ring-1 focus:ring-indigo-300 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
          disabled={isSorting}
        >
          {Object.keys(sortingAlgorithms).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleSort}
          disabled={isSorting}
          className={`w-full sm:w-auto px-4 py-2 rounded-md text-white font-medium disabled:opacity-50 text-sm ${
            isSorting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isSorting ? <span className="animate-pulse">Sorting...</span> : "Visualize"}
        </button>
      </div>

      {/* Main Grid Container for the 2x2 layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-5xl mx-auto">
        {/* Card 1: Algorithm Description */}
        <Card title={`${currentAlgorithmInfo.name} Algorithm Description`}>
          <h3 className="text-base font-semibold mb-1 text-gray-900 dark:text-gray-50 sr-only">{currentAlgorithmInfo.name}</h3>
          <p className="mb-2 leading-snug">
            {currentAlgorithmInfo.description}
          </p>
          <div className="text-xs mt-2">
            <p className="font-medium">Time Complexity: <span className="font-normal">{currentAlgorithmInfo.timeComplexity}</span></p>
            <p className="font-medium">Space Complexity: <span className="font-normal">{currentAlgorithmInfo.spaceComplexity}</span></p>
          </div>
        </Card>

        {/* Card 2: Algorithm Code */}
        <Card title="Algorithm Code">
          {codeMap[selectedAlgo].map((line, idx) => (
            <pre
              key={idx}
              className={`transition-all duration-200 whitespace-pre-wrap
                ${idx === currentLine ? "bg-yellow-200 dark:bg-yellow-700 text-black dark:text-white font-semibold" : ""}
              `}
            >
              {line}
            </pre>
          ))}
        </Card>

        {/* Card 3: Array Visualization */}
        <Card
          title="Array Visualization"
          contentClassName="justify-center items-end h-full w-full gap-[1px] sm:gap-[3px] pt-4 flex"
        >
          {array.map((val, i) => {
            const isHighlighted = highlight.includes(i);
            const isPrimaryHighlight = highlight[0] === i && highlight[1] !== -1;
            const isSecondaryHighlight = highlight[1] === i && highlight[0] !== -1;

            const barHeightPercentage = (val / MAX_BAR_VALUE) * 100;
            
            return (
              <div
                key={i}
                style={{ height: `${barHeightPercentage}%`, flexBasis: `calc(${100 / array.length}% - 3px)` }}
                className={`flex-shrink-0 bg-indigo-500 rounded-sm transition-colors duration-300 flex items-end justify-center relative
                  ${isPrimaryHighlight ? "bg-red-500" : ""}
                  ${isSecondaryHighlight ? "bg-blue-400" : ""}
                  ${isHighlighted && !isPrimaryHighlight && !isSecondaryHighlight ? "bg-yellow-400" : ""}
                `}
              >
                <span className="text-xs text-gray-800 dark:text-gray-200 select-none absolute bottom-1">
                  {val}
                </span>
              </div>
            );
          })}
        </Card>

        {/* Card 4: Thought Process */}
        <Card title="Thought Process" height="h-[230px]" ref={logRef} contentClassName="text-xs">
          {thoughtLog.length === 0 ? (
            <p className="italic text-gray-500">Thought log will appear here...</p>
          ) : (
            thoughtLog.map((log, i) => (
              <p
                key={i}
                className={`mb-1 ${log === 'Array is sorted!' ? 'text-green-600 font-bold' : ''}`}
              >
                {log}
              </p>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}