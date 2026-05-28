import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Code2,
  FileCode2,
  Filter,
  Lightbulb,
  ListChecks,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { RichText } from "../components/RichText";

type ReviewLanguage = "C++" | "Python" | "DSA";

interface ReviewItem {
  id: string;
  title: string;
  language: ReviewLanguage;
  topic: string;
  summary: string;
  remember: string[];
  likelyAsks: string[];
  example: string;
  interviewAngle: string;
  tags: string[];
}

const reviewItems = [
  {
    id: "cpp-stl-containers",
    title: "C++ STL containers: what to reach for",
    language: "C++",
    topic: "STL",
    summary:
      "Interview code usually expects quick, correct use of STL containers instead of manual data-structure plumbing.",
    remember: [
      "vector: dynamic array, O(1) amortized push_back, O(n) insert/erase in middle",
      "string: mutable sequence with useful find/substr operations",
      "unordered_map / unordered_set: average O(1), worst-case can degrade",
      "map / set: ordered tree, O(log n), useful when sorted order is required",
      "queue / stack / priority_queue: restricted access containers for BFS, stack patterns, and heap problems",
    ],
    likelyAsks: [
      "Which container would you use and why?",
      "What is the time complexity of insert, lookup, and erase?",
      "When is map better than unordered_map?",
    ],
    example:
      "```cpp\nunordered_map<string, int> freq;\nfor (const string& word : words) {\n  freq[word]++;\n}\n\npriority_queue<int> max_heap;\nqueue<int> bfs_queue;\nstack<int> dfs_stack;\n```",
    interviewAngle:
      "Name the invariant and the operation cost. If the problem needs order, use `map` or sorting. If it only needs membership/counting, `unordered_map` is usually the first choice.",
    tags: ["cpp", "stl", "complexity", "map", "heap", "stack", "queue"],
  },
  {
    id: "cpp-reference-const-copy",
    title: "C++ references, const, and copying",
    language: "C++",
    topic: "C++ Core",
    summary:
      "A common review area is whether you understand pass-by-value, pass-by-reference, const correctness, and unnecessary copies.",
    remember: [
      "Use `const T&` for large read-only inputs",
      "Use `T&` when the function must mutate the caller's object",
      "Use pass-by-value for small scalar types such as int, char, bool",
      "Returning a reference to a local variable is invalid",
      "Copying vectors, strings, and maps inside recursion can quietly make solutions too slow",
    ],
    likelyAsks: [
      "Why pass `vector<int>&` instead of `vector<int>`?",
      "What does `const` protect here?",
      "Where can an accidental copy happen?",
    ],
    example:
      "```cpp\nvoid dfs(int node, const vector<vector<int>>& graph, vector<int>& seen) {\n  seen[node] = 1;\n  for (int next : graph[node]) {\n    if (!seen[next]) dfs(next, graph, seen);\n  }\n}\n```",
    interviewAngle:
      "Explain ownership and mutation. For interview code, `const vector<vector<int>>& graph` communicates read-only input, while `vector<int>& seen` communicates shared mutable state.",
    tags: ["cpp", "references", "const", "copy", "dfs", "pitfalls"],
  },
  {
    id: "cpp-sort-comparator",
    title: "C++ sorting and custom comparators",
    language: "C++",
    topic: "STL",
    summary:
      "Sorting appears in interval, greedy, two-pointer, sweep-line, and scheduling problems.",
    remember: [
      "`sort(v.begin(), v.end())` is O(n log n)",
      "Comparator returns true when left should come before right",
      "Tie-breaking should be explicit",
      "For priority_queue, comparator semantics feel reversed because the top is the highest-priority element",
    ],
    likelyAsks: [
      "Sort intervals by start, then end",
      "Build a min-heap in C++",
      "Explain comparator tie-breaking",
    ],
    example:
      "```cpp\nsort(intervals.begin(), intervals.end(), [](auto& a, auto& b) {\n  if (a[0] != b[0]) return a[0] < b[0];\n  return a[1] < b[1];\n});\n\npriority_queue<int, vector<int>, greater<int>> min_heap;\n```",
    interviewAngle:
      "Say the exact ordering rule out loud. Many bugs in interval problems are really comparator or tie-breaking bugs.",
    tags: ["cpp", "sort", "comparator", "heap", "stl"],
  },
  {
    id: "cpp-map-vs-unordered-map",
    title: "C++ map vs unordered_map",
    language: "C++",
    topic: "STL",
    summary:
      "This comes up when the interviewer wants to see if you understand order, hashing, and complexity tradeoffs.",
    remember: [
      "unordered_map: hash table, average O(1), no sorted iteration",
      "map: balanced tree, O(log n), keys iterate in sorted order",
      "unordered_map needs hashable keys; custom keys need a hash function",
      "map can answer ordered traversal needs without an extra sort",
    ],
    likelyAsks: [
      "Why did you choose unordered_map?",
      "What if output must be sorted by key?",
      "What is the worst-case complexity?",
    ],
    example:
      "```cpp\nunordered_map<int, int> count_by_value;\nmap<int, vector<int>> events_by_time;\n```",
    interviewAngle:
      "Default to `unordered_map` for frequency and lookup. Switch to `map` when sorted order or range-like traversal matters.",
    tags: ["cpp", "map", "hash", "complexity", "stl"],
  },
  {
    id: "cpp-memory-raii",
    title: "C++ memory and RAII basics",
    language: "C++",
    topic: "C++ Core",
    summary:
      "Even if coding interviews rarely require manual memory management, RAII and ownership can appear in review conversations.",
    remember: [
      "Prefer automatic storage and STL containers over raw new/delete",
      "RAII ties resource lifetime to object lifetime",
      "unique_ptr expresses single ownership",
      "shared_ptr expresses shared ownership but has overhead and possible cycles",
      "Dangling pointers and references are common C++ failure modes",
    ],
    likelyAsks: [
      "What is RAII?",
      "When would you use unique_ptr?",
      "Why avoid raw owning pointers?",
    ],
    example:
      "```cpp\nstruct Node {\n  int value;\n  unique_ptr<Node> next;\n};\n\nvector<int> values; // owns its storage and releases automatically\n```",
    interviewAngle:
      "For algorithm rounds, keep memory simple. For systems-style follow-ups, talk about ownership, lifetime, and avoiding leaks or dangling references.",
    tags: ["cpp", "memory", "raii", "ownership", "pitfalls"],
  },
  {
    id: "python-containers-complexity",
    title: "Python containers and complexity",
    language: "Python",
    topic: "Python Core",
    summary:
      "Python interviews often test whether you know the standard containers and their expected costs.",
    remember: [
      "list append/pop from end: O(1) amortized",
      "list pop(0) and insert(0, x): O(n)",
      "dict and set membership: average O(1)",
      "tuple is immutable and hashable if its contents are hashable",
      "Use set for visited nodes and duplicate detection",
    ],
    likelyAsks: [
      "Why is `x in set` faster than `x in list`?",
      "Why avoid `pop(0)` for BFS?",
      "When use tuple as a dictionary key?",
    ],
    example:
      "```python\nseen: set[tuple[int, int]] = set()\nseen.add((row, col))\n\ncount: dict[str, int] = {}\ncount[word] = count.get(word, 0) + 1\n```",
    interviewAngle:
      "When writing Python, container choice is often the performance answer. Mention average-case hash table behavior and avoid O(n) queue operations.",
    tags: ["python", "containers", "complexity", "set", "dict", "pitfalls"],
  },
  {
    id: "python-collections-toolbox",
    title: "Python collections toolbox",
    language: "Python",
    topic: "Python Core",
    summary:
      "`collections` and `heapq` cover many interview patterns cleanly.",
    remember: [
      "deque: O(1) append/pop from both ends, ideal for BFS queues",
      "Counter: frequency maps",
      "defaultdict(list): grouping adjacency lists",
      "heapq: min-heap operations on a list",
      "Use negative values for max-heap behavior with heapq",
    ],
    likelyAsks: [
      "Build graph adjacency from edges",
      "Find top K frequent elements",
      "Run BFS without list pop(0)",
    ],
    example:
      "```python\nfrom collections import Counter, defaultdict, deque\nimport heapq\n\ngraph = defaultdict(list)\nfor a, b in edges:\n    graph[a].append(b)\n\nq = deque([start])\nfreq = Counter(nums)\nheapq.heappush(heap, (distance, node))\n```",
    interviewAngle:
      "These libraries are acceptable in most Python interviews. The key is to still explain the data-structure behavior underneath.",
    tags: ["python", "collections", "deque", "heap", "queue", "graph"],
  },
  {
    id: "python-sorting-key",
    title: "Python sorting, key functions, and tuples",
    language: "Python",
    topic: "Python Core",
    summary:
      "Python's `key=` style is concise and useful for intervals, strings, custom ranking, and tie-breaking.",
    remember: [
      "`sorted(items)` returns a new list",
      "`items.sort()` sorts in place",
      "`key=lambda x: (...)` supports multi-level ordering",
      "Tuple comparison is lexicographic",
      "Sorting is O(n log n)",
    ],
    likelyAsks: [
      "Sort intervals by start then end",
      "Sort words by length then lexicographic order",
      "Sort in descending order",
    ],
    example:
      "```python\nintervals.sort(key=lambda x: (x[0], x[1]))\nwords = sorted(words, key=lambda w: (len(w), w))\nnums.sort(reverse=True)\n```",
    interviewAngle:
      "State the ordering rule clearly. In Python, tuple keys are usually the cleanest way to avoid comparator noise.",
    tags: ["python", "sort", "lambda", "complexity"],
  },
  {
    id: "python-common-pitfalls",
    title: "Python pitfalls that interviewers may poke",
    language: "Python",
    topic: "Python Core",
    summary:
      "These are not always the main question, but they are common follow-up traps when reviewing Python code.",
    remember: [
      "Avoid mutable default arguments such as `def f(x=[])`",
      "`[[0] * n] * m` aliases the same inner list",
      "Use `//` for floor division; `/` returns float",
      "Slicing copies lists",
      "Recursive DFS may hit recursion depth on large graphs",
    ],
    likelyAsks: [
      "Why did all rows change in my matrix?",
      "What is wrong with a default list argument?",
      "Why did recursion fail on a deep input?",
    ],
    example:
      "```python\n# Good matrix construction\ngrid = [[0 for _ in range(cols)] for _ in range(rows)]\n\n# Avoid mutable default args\ndef add_item(item, bucket=None):\n    if bucket is None:\n        bucket = []\n    bucket.append(item)\n    return bucket\n```",
    interviewAngle:
      "If a Python solution looks right but behaves strangely, aliasing and mutation are prime suspects.",
    tags: ["python", "pitfalls", "mutation", "recursion"],
  },
  {
    id: "dsa-dfs-pattern",
    title: "DFS pattern: explore a full branch/component",
    language: "DSA",
    topic: "DFS",
    summary:
      "DFS is the go-to pattern for connected components, tree recursion, path existence, backtracking, and flood fill.",
    remember: [
      "Define what a node/state is",
      "Mark visited before exploring neighbors to avoid cycles",
      "Recursive DFS is concise; iterative DFS avoids recursion depth",
      "For backtracking, undo choices when returning",
      "Time is usually O(V + E) for graph traversal",
    ],
    likelyAsks: [
      "Count islands or connected components",
      "Determine if a path exists",
      "Traverse a tree recursively",
    ],
    example:
      "```python\ndef dfs(node):\n    seen.add(node)\n    for nxt in graph[node]:\n        if nxt not in seen:\n            dfs(nxt)\n```",
    interviewAngle:
      "Say what `seen` means. If the state space is not just a node, the visited key may need to include position, mask, direction, or remaining resource.",
    tags: ["dsa", "dfs", "graph", "recursion", "complexity"],
  },
  {
    id: "dsa-bfs-pattern",
    title: "BFS pattern: shortest path in unweighted state space",
    language: "DSA",
    topic: "BFS",
    summary:
      "BFS explores by layers, so it is the natural answer for minimum number of edges or steps when every move has equal cost.",
    remember: [
      "Use a FIFO queue",
      "Mark visited when enqueuing to avoid duplicate queue entries",
      "Store distance separately or with each queued state",
      "Return when the target is first reached",
      "For weighted edges, consider Dijkstra instead",
    ],
    likelyAsks: [
      "Shortest path in a grid",
      "Minimum moves from one state to another",
      "Level-order traversal of a tree",
    ],
    example:
      "```python\nfrom collections import deque\n\nq = deque([(start, 0)])\nseen = {start}\nwhile q:\n    node, dist = q.popleft()\n    if node == target:\n        return dist\n    for nxt in neighbors(node):\n        if nxt not in seen:\n            seen.add(nxt)\n            q.append((nxt, dist + 1))\n```",
    interviewAngle:
      "The magic phrase is 'unweighted shortest path'. If moves have different costs, plain BFS no longer proves optimality.",
    tags: ["dsa", "bfs", "queue", "shortest-path", "graph", "grid"],
  },
  {
    id: "dsa-stack-patterns",
    title: "Stack patterns that show up often",
    language: "DSA",
    topic: "Stack",
    summary:
      "A stack models the most recent unresolved item. That idea appears in parentheses, expression parsing, DFS, and monotonic stack problems.",
    remember: [
      "Valid parentheses: top must match the closing bracket",
      "Expression evaluation: operators consume recent operands",
      "Monotonic stack: keep increasing or decreasing candidates",
      "Iterative DFS: stack stores frontier states",
      "Use stack when the newest unresolved thing should be handled first",
    ],
    likelyAsks: [
      "Valid parentheses",
      "Evaluate Reverse Polish Notation",
      "Next greater element",
      "Largest rectangle in histogram",
    ],
    example:
      "```python\nstack = []\nfor x in nums:\n    while stack and stack[-1] < x:\n        prev = stack.pop()\n        # x is the next greater value for prev\n    stack.append(x)\n```",
    interviewAngle:
      "For monotonic stacks, explain what order the stack maintains and why popped elements are resolved permanently.",
    tags: ["dsa", "stack", "monotonic-stack", "expression", "dfs"],
  },
  {
    id: "dsa-queue-deque-patterns",
    title: "Queue and deque patterns",
    language: "DSA",
    topic: "Queue",
    summary:
      "Queues handle FIFO traversal. Deques extend that idea for two-ended windows and monotonic queues.",
    remember: [
      "BFS queue processes older states first",
      "Use deque for efficient pop-left operations",
      "Sliding window maximum uses a decreasing deque of candidates",
      "0-1 BFS uses deque when edge weights are only 0 or 1",
      "Queue contents should have a clear invariant",
    ],
    likelyAsks: [
      "Tree level-order traversal",
      "Shortest path in grid",
      "Sliding window maximum",
      "Implement queue with stacks",
    ],
    example:
      "```python\nfrom collections import deque\n\ndq = deque()\nfor i, value in enumerate(nums):\n    while dq and nums[dq[-1]] <= value:\n        dq.pop()\n    dq.append(i)\n    if dq[0] <= i - k:\n        dq.popleft()\n```",
    interviewAngle:
      "For deque problems, the answer is usually the invariant: what order is preserved, and when do old candidates expire?",
    tags: ["dsa", "queue", "deque", "bfs", "sliding-window"],
  },
  {
    id: "dsa-graph-representation",
    title: "Graph representation and visited timing",
    language: "DSA",
    topic: "Graph",
    summary:
      "Graph bugs often come from building adjacency incorrectly or marking visited at the wrong time.",
    remember: [
      "Adjacency list is usually best for sparse graphs",
      "For undirected edges, add both directions",
      "For directed edges, add only the given direction",
      "In BFS, mark visited when enqueueing",
      "In DFS, mark visited before recursive exploration",
    ],
    likelyAsks: [
      "Build adjacency list from edge pairs",
      "Explain directed vs undirected graph handling",
      "Why is this node visited twice?",
    ],
    example:
      "```python\ngraph = [[] for _ in range(n)]\nfor a, b in edges:\n    graph[a].append(b)\n    graph[b].append(a)  # omit this line for directed graphs\n```",
    interviewAngle:
      "Always clarify whether the graph is directed and whether nodes are 0-indexed, 1-indexed, strings, or arbitrary labels.",
    tags: ["dsa", "graph", "bfs", "dfs", "visited"],
  },
  {
    id: "dsa-complexity-edge-cases",
    title: "Complexity and edge-case review",
    language: "DSA",
    topic: "Complexity",
    summary:
      "Interviewers often care as much about your reasoning and edge cases as the final code.",
    remember: [
      "State time and space after the solution",
      "For graph traversal, time is commonly O(V + E)",
      "For grid traversal, time is commonly O(rows * cols)",
      "Check empty input, one element, duplicates, disconnected graph, blocked start/end",
      "Mention recursion stack space when using recursive DFS",
    ],
    likelyAsks: [
      "What is the complexity?",
      "What happens on empty input?",
      "Can recursion overflow?",
      "How would this change with weighted edges?",
    ],
    example:
      "```text\nChecklist before final answer:\n1. Input bounds and empty cases\n2. Data structure invariant\n3. Time complexity\n4. Space complexity\n5. One small example walk-through\n```",
    interviewAngle:
      "A clean complexity explanation can rescue an imperfect implementation. Make the invariant and edge cases explicit.",
    tags: ["dsa", "complexity", "edge-cases", "review"],
  },
] satisfies ReviewItem[];

const languageFilters = [
  { id: "all", label: "All" },
  { id: "C++", label: "C++" },
  { id: "Python", label: "Python" },
  { id: "DSA", label: "DSA" },
] as const;

const topicFilters = [
  { id: "all", label: "All Topics" },
  { id: "dfs", label: "DFS" },
  { id: "bfs", label: "BFS" },
  { id: "stack", label: "Stack" },
  { id: "queue", label: "Queue" },
  { id: "graph", label: "Graph" },
  { id: "complexity", label: "Complexity" },
  { id: "stl", label: "STL" },
  { id: "python", label: "Python Core" },
] as const;

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function countBy(predicate: (item: ReviewItem) => boolean) {
  return reviewItems.filter(predicate).length;
}

function matchesSearch(item: ReviewItem, query: string) {
  const terms = normalize(query).split(" ").filter(Boolean);

  if (!terms.length) {
    return true;
  }

  const searchable = normalize(
    [
      item.id,
      item.title,
      item.language,
      item.topic,
      item.summary,
      item.interviewAngle,
      item.example,
      ...item.remember,
      ...item.likelyAsks,
      ...item.tags,
    ].join(" "),
  );

  return terms.every((term) => searchable.includes(term));
}

function getLanguageBadgeStyle(language: ReviewLanguage) {
  const styles: Record<ReviewLanguage, string> = {
    "C++": "bg-sky-100 text-ink-950",
    Python: "bg-emerald-100 text-ink-950",
    DSA: "bg-amber-100 text-ink-950",
  };

  return styles[language];
}

export function ProgrammingReview() {
  const [language, setLanguage] =
    useState<(typeof languageFilters)[number]["id"]>("all");
  const [topic, setTopic] = useState<(typeof topicFilters)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(reviewItems[0]?.id ?? "");

  const filteredItems = useMemo(
    () =>
      reviewItems.filter((item) => {
        const matchesLanguage = language === "all" || item.language === language;
        const matchesTopic = topic === "all" || item.tags.includes(topic);

        return matchesLanguage && matchesTopic && matchesSearch(item, query);
      }),
    [language, query, topic],
  );

  useEffect(() => {
    if (!filteredItems.some((item) => item.id === selectedId)) {
      setSelectedId(filteredItems[0]?.id ?? "");
    }
  }, [filteredItems, selectedId]);

  const selectedItem =
    filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0];
  const selectedIndex = selectedItem
    ? filteredItems.findIndex((item) => item.id === selectedItem.id)
    : -1;
  const hasFilters = language !== "all" || topic !== "all" || query.trim().length > 0;
  const visibleTags = selectedItem?.tags.slice(0, 6) ?? [];

  const resetFilters = () => {
    setLanguage("all");
    setTopic("all");
    setQuery("");
  };

  const moveSelection = (direction: -1 | 1) => {
    if (selectedIndex === -1 || filteredItems.length === 0) {
      return;
    }

    const nextIndex =
      (selectedIndex + direction + filteredItems.length) % filteredItems.length;
    setSelectedId(filteredItems[nextIndex].id);
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="panel p-5 sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-canvas text-primary">
                <BookOpenCheck size={22} aria-hidden="true" />
              </div>
              <h3 className="display-heading mt-4 text-[28px] leading-tight">
                Interview review workspace
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-body">
                Use this as a quick concept deck before coding interviews: pick
                an area, scan the likely asks, then rehearse the explanation.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold sm:w-[360px]">
              <div className="rounded-md bg-canvas px-2 py-3">
                Cards
                <span className="mt-1 block text-xl text-primary">
                  {reviewItems.length}
                </span>
              </div>
              <div className="rounded-md bg-canvas px-2 py-3">
                Showing
                <span className="mt-1 block text-xl text-primary">
                  {filteredItems.length}
                </span>
              </div>
              <div className="rounded-md bg-canvas px-2 py-3">
                Areas
                <span className="mt-1 block text-xl text-primary">3</span>
              </div>
            </div>
          </div>
        </div>

        <div className="panel p-5">
          <p className="text-sm font-semibold text-primary">Study mix</p>
          <div className="mt-4 grid gap-3">
            {[
              {
                icon: FileCode2,
                label: "C++",
                value: countBy((item) => item.language === "C++"),
              },
              {
                icon: Code2,
                label: "Python",
                value: countBy((item) => item.language === "Python"),
              },
              {
                icon: ListChecks,
                label: "DSA",
                value: countBy((item) => item.language === "DSA"),
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  className="flex items-center justify-between rounded-md bg-canvas px-3 py-3"
                  key={item.label}
                >
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-body">
                    <Icon size={16} aria-hidden="true" />
                    {item.label}
                  </span>
                  <span className="font-code text-sm font-semibold text-primary">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="product-panel overflow-hidden">
        <div className="border-b border-hairline bg-surface-soft px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <Filter size={16} aria-hidden="true" />
              Focus controls
            </div>
            <button
              className="button-secondary min-h-9 px-3 py-2"
              disabled={!hasFilters}
              onClick={resetFilters}
              type="button"
            >
              <RotateCcw size={15} aria-hidden="true" />
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-normal text-muted">
              Search review notes, examples, and likely asks
            </span>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                size={18}
                aria-hidden="true"
              />
              <input
                className="field pl-10"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try const, deque, dfs, bfs, complexity..."
              />
            </div>
          </label>

          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-normal text-muted">
                Area
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
                {languageFilters.map((item) => (
                  <button
                    className={`min-h-10 rounded-md px-3 py-2 text-sm font-semibold transition ${
                      language === item.id
                        ? "bg-action text-on-action"
                        : "bg-canvas text-primary"
                    }`}
                    key={item.id}
                    onClick={() => setLanguage(item.id)}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-normal text-muted">
                Topic
              </p>
              <div className="flex flex-wrap gap-2">
                {topicFilters.map((item) => (
                  <button
                    className={`min-h-10 rounded-md px-3 py-2 text-sm font-semibold transition ${
                      topic === item.id
                        ? "bg-action text-on-action"
                        : "bg-canvas text-primary"
                    }`}
                    key={item.id}
                    onClick={() => setTopic(item.id)}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="product-panel h-fit overflow-hidden lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]">
          <div className="flex items-center justify-between gap-3 border-b border-hairline bg-canvas px-4 py-3">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-body">
              <SlidersHorizontal size={16} aria-hidden="true" />
              {filteredItems.length} matching
            </div>
            <span className="text-xs font-semibold uppercase tracking-normal text-muted">
              Review
            </span>
          </div>

          <div className="max-h-[520px] divide-y divide-hairline overflow-y-auto lg:max-h-[calc(100vh-10rem)]">
            {filteredItems.map((item) => {
              const isSelected = item.id === selectedItem?.id;

              return (
                <button
                  className={`block w-full border-l-4 px-4 py-4 text-left transition ${
                    isSelected
                      ? "border-primary bg-surface-soft"
                      : "border-transparent bg-canvas hover:bg-surface-soft"
                  }`}
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  type="button"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="badge-pill bg-sky-100 text-ink-950">
                      {item.language}
                    </span>
                    <span className="badge-pill bg-surface-card text-primary">
                      {item.topic}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-6 text-primary">
                    {item.title}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-muted">
                    {item.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        className="rounded-md bg-surface-card px-2 py-1 text-[11px] font-semibold text-muted"
                        key={tag}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}

            {filteredItems.length === 0 ? (
              <div className="px-4 py-8 text-sm leading-6 text-body">
                No programming review cards match these filters.
              </div>
            ) : null}
          </div>
        </aside>

        {selectedItem ? (
          <article className="product-panel overflow-hidden">
            <div className="border-b border-hairline bg-canvas px-5 py-4">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`badge-pill ${getLanguageBadgeStyle(
                        selectedItem.language,
                      )}`}
                    >
                      {selectedItem.language}
                    </span>
                    <span className="badge-pill bg-surface-card text-primary">
                      {selectedItem.topic}
                    </span>
                    {visibleTags.map((tag) => (
                      <span
                        className="badge-pill bg-surface-card text-primary"
                        key={tag}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 font-code text-xs font-semibold text-muted">
                    {selectedItem.id}
                  </p>
                  <h3 className="display-heading mt-2 text-[28px] leading-tight">
                    {selectedItem.title}
                  </h3>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-body">
                    {selectedItem.summary}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    className="icon-button"
                    onClick={() => moveSelection(-1)}
                    title="Previous review card"
                    type="button"
                  >
                    <ArrowLeft size={17} aria-hidden="true" />
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => moveSelection(1)}
                    title="Next review card"
                    type="button"
                  >
                    <ArrowRight size={17} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <section className="border-b border-hairline p-5 lg:border-b-0 lg:border-r">
                <h4 className="inline-flex items-center gap-2 text-sm font-semibold text-muted">
                  <CheckCircle2 size={16} aria-hidden="true" />
                  What to remember
                </h4>
                <ul className="mt-3 space-y-2">
                  {selectedItem.remember.map((item) => (
                    <li
                      className="rounded-md border border-hairline bg-surface-soft px-3 py-2 text-sm leading-6 text-primary"
                      key={item}
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <h4 className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-muted">
                  <Lightbulb size={16} aria-hidden="true" />
                  May be asked as
                </h4>
                <div className="mt-3 grid gap-2">
                  {selectedItem.likelyAsks.map((item) => (
                    <div
                      className="rounded-md border border-hairline bg-canvas px-3 py-2 text-sm leading-6 text-body"
                      key={item}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section className="p-5">
                <h4 className="text-sm font-semibold text-muted">
                  Example / template
                </h4>
                <div className="mt-3">
                  <RichText text={selectedItem.example} />
                </div>

                <h4 className="mt-6 text-sm font-semibold text-muted">
                  Interview angle
                </h4>
                <div className="mt-3 rounded-md border border-hairline bg-surface-soft px-4 py-3">
                  <RichText
                    text={selectedItem.interviewAngle}
                    textClassName="text-sm leading-6 text-primary"
                  />
                </div>
              </section>
            </div>
          </article>
        ) : (
          <div className="panel p-8 text-sm leading-6 text-body">
            Pick a review card to study likely interview concepts, examples, and
            explanation angles.
          </div>
        )}
      </div>
    </div>
  );
}
