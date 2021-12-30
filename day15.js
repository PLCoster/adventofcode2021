/**
 * --- Day 15: Chiton ---
You've almost reached the exit of the cave, but the walls are getting closer together. Your submarine can barely still fit, though; the main problem is that the walls of the cave are covered in chitons, and it would be best not to bump any of them.

The cavern is large, but has a very low ceiling, restricting your motion to two dimensions. The shape of the cavern resembles a square; a quick scan of chiton density produces a map of risk level throughout the cave (your puzzle input). For example:

1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581
You start in the top left position, your destination is the bottom right position, and you cannot move diagonally. The number at each position is its risk level; to determine the total risk of an entire path, add up the risk levels of each position you enter (that is, don't count the risk level of your starting position unless you enter it; leaving it adds no risk to your total).

Your goal is to find a path with the lowest total risk. In this example, a path with the lowest total risk is highlighted here:

1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581
The total risk of this path is 40 (the starting position is never entered, so its risk is not counted).

What is the lowest total risk of any path from the top left to the bottom right?
 */

// Try Djikstra's Algorithm to find the shortest path through a graph??

const fs = require('fs');

// const testInput = fs.readFileSync('./input/day15_test.txt', 'utf-8');

// console.log(minRisk(testInput)); // 40

const input = fs.readFileSync('./input/day15.txt', 'utf-8');

// Calculate the minimum risk route on the small size cave
// Completes in < 500ms
console.log('Part 1 Answer: Lowest Risk Path across graph: ', minRisk(input)); // 609

/**
 * Parses puzzle input and returns 2D array representing the risk map of the cave.
 * @param {String} input Raw puzzle input as a string
 * @param {Boolean} largeCave Flag to indicate whether to turn the input into the large cave (5 x width and 5 x height)
 * @returns {Number[][]} 2D array representing the risk of each location in the cave.
 */
function parseInput(input, largeCave = false) {
  const small = input
    .split('\n')
    .map((str) => str.split('').map((el) => parseInt(el)));
  if (!largeCave) {
    return small;
  }

  // Otherwise we need to 5x the input graph in each dimension, and each time we add to it we increase the risk of each value by 1 (9 wraps to 1);
  const large = new Array();
  for (let i = 0; i < small.length * 5; i += 1) {
    large.push(new Array(small[0].length * 5));
  }

  // Iterate through small graph and create large graph:
  for (let i = 0; i < small.length; i += 1) {
    for (let j = 0; j < small[0].length; j += 1) {
      const num = small[i][j];
      for (let k = 0; k < 5; k += 1) {
        for (let l = 0; l < 5; l += 1) {
          const newRow = i + k * small.length;
          const newCol = j + l * small[0].length;
          let newVal = num + k + l;
          if (newVal > 9) {
            newVal = newVal % 9;
          }
          large[newRow][newCol] = newVal;
        }
      }
    }
  }
  return large;
}

/**
 * Locates the next position in the map that should be explored and returns its coordinates
 * @param {Number[][]} distMap 2D array holding the current known shortest distances from the start to each location.
 * @param {Boolean[][]} visitMap 2D array indicating whether or not each location in the map has been explored or not
 * @returns {Number[]} Array containing the row and col indices of the next position to explore
 */
function minValInd(distMap, visitMap) {
  let min = Infinity;
  let minPos;
  for (let i = 0; i < distMap.length; i += 1) {
    for (let j = 0; j < distMap[0].length; j += 1) {
      if (distMap[i][j] < min && !visitMap[i][j]) {
        min = distMap[i][j];
        minPos = [i, j];
      }
    }
  }
  return minPos;
}

/**
 * Calculates the minimum Risk path from the start to the end of the cave.
 * @param {String} input Raw puzzle input
 * @param {Boolean} largeCave Flag to indicate whether to solve for raw input or create 5x larger cave (default raw input)
 * @param {Boolean} logging Flag that logs algorithm progress to console (default false)
 * @returns Minimum Risk of Path from start to end of cave.
 */
function minRisk(input, largeCave = false, logging = false) {
  const map = parseInput(input, largeCave);

  const distMap = [];
  const visitMap = [];
  for (let i = 0; i < map.length; i += 1) {
    const arr = new Array(map[0].length).fill(Infinity);
    distMap.push(arr);
    const arr2 = new Array(map[0].length).fill(false);
    visitMap.push(arr2);
  }

  // Set start pos distance to 0
  distMap[0][0] = 0;

  // Run until all nodes explored:
  let numExplored = 0;
  let maxRow = map.length;
  let maxCol = map[0].length;

  while (numExplored < maxRow * maxCol) {
    if (numExplored % 1000 === 0 && logging) {
      console.log('Explored so far: ', numExplored, '/', maxRow * maxCol);
    }
    // Find the next node to explore:
    const [row, col] = minValInd(distMap, visitMap);

    // Explore all possible neighbouring nodes:
    for (let inc = -1; inc < 2; inc += 2) {
      // Check node above/below
      const newRow = row + inc;
      if (newRow >= 0 && newRow < maxRow) {
        const newDist = distMap[row][col] + map[newRow][col];
        if (newDist < distMap[newRow][col]) {
          distMap[newRow][col] = newDist;
        }
      }
      // Check node left/right
      const newCol = col + inc;
      if (newCol >= 0 && newCol < maxCol) {
        const newDist = distMap[row][col] + map[row][newCol];
        if (newDist < distMap[row][newCol]) {
          distMap[row][newCol] = newDist;
        }
      }
    }

    // Mark current node as visited:
    visitMap[row][col] = true;
    numExplored += 1;
  }

  return distMap[map.length - 1][map[0].length - 1];
}

/**
 * --- Part Two ---
Now that you know how to find low-risk paths in the cave, you can try to find your way out.

The entire cave is actually five times larger in both dimensions than you thought; the area you originally scanned is just one tile in a 5x5 tile area that forms the full map. Your original map tile repeats to the right and downward; each time the tile repeats to the right or downward, all of its risk levels are 1 higher than the tile immediately up or left of it. However, risk levels above 9 wrap back around to 1. So, if your original map had some position with a risk level of 8, then that same position on each of the 25 total tiles would be as follows:

8 9 1 2 3
9 1 2 3 4
1 2 3 4 5
2 3 4 5 6
3 4 5 6 7
Each single digit above corresponds to the example position with a value of 8 on the top-left tile. Because the full map is actually five times larger in both dimensions, that position appears a total of 25 times, once in each duplicated tile, with the values shown above.

Here is the full five-times-as-large version of the first example above, with the original map in the top left corner highlighted:

11637517422274862853338597396444961841755517295286
13813736722492484783351359589446246169155735727126
21365113283247622439435873354154698446526571955763
36949315694715142671582625378269373648937148475914
74634171118574528222968563933317967414442817852555
13191281372421239248353234135946434524615754563572
13599124212461123532357223464346833457545794456865
31254216394236532741534764385264587549637569865174
12931385212314249632342535174345364628545647573965
23119445813422155692453326671356443778246755488935
22748628533385973964449618417555172952866628316397
24924847833513595894462461691557357271266846838237
32476224394358733541546984465265719557637682166874
47151426715826253782693736489371484759148259586125
85745282229685639333179674144428178525553928963666
24212392483532341359464345246157545635726865674683
24611235323572234643468334575457944568656815567976
42365327415347643852645875496375698651748671976285
23142496323425351743453646285456475739656758684176
34221556924533266713564437782467554889357866599146
33859739644496184175551729528666283163977739427418
35135958944624616915573572712668468382377957949348
43587335415469844652657195576376821668748793277985
58262537826937364893714847591482595861259361697236
96856393331796741444281785255539289636664139174777
35323413594643452461575456357268656746837976785794
35722346434683345754579445686568155679767926678187
53476438526458754963756986517486719762859782187396
34253517434536462854564757396567586841767869795287
45332667135644377824675548893578665991468977611257
44961841755517295286662831639777394274188841538529
46246169155735727126684683823779579493488168151459
54698446526571955763768216687487932779859814388196
69373648937148475914825958612593616972361472718347
17967414442817852555392896366641391747775241285888
46434524615754563572686567468379767857948187896815
46833457545794456865681556797679266781878137789298
64587549637569865174867197628597821873961893298417
45364628545647573965675868417678697952878971816398
56443778246755488935786659914689776112579188722368
55172952866628316397773942741888415385299952649631
57357271266846838237795794934881681514599279262561
65719557637682166874879327798598143881961925499217
71484759148259586125936169723614727183472583829458
28178525553928963666413917477752412858886352396999
57545635726865674683797678579481878968159298917926
57944568656815567976792667818781377892989248891319
75698651748671976285978218739618932984172914319528
56475739656758684176786979528789718163989182927419
67554889357866599146897761125791887223681299833479
Equipped with the full map, you can now find a path from the top left corner to the bottom right corner with the lowest total risk:

11637517422274862853338597396444961841755517295286
13813736722492484783351359589446246169155735727126
21365113283247622439435873354154698446526571955763
36949315694715142671582625378269373648937148475914
74634171118574528222968563933317967414442817852555
13191281372421239248353234135946434524615754563572
13599124212461123532357223464346833457545794456865
31254216394236532741534764385264587549637569865174
12931385212314249632342535174345364628545647573965
23119445813422155692453326671356443778246755488935
22748628533385973964449618417555172952866628316397
24924847833513595894462461691557357271266846838237
32476224394358733541546984465265719557637682166874
47151426715826253782693736489371484759148259586125
85745282229685639333179674144428178525553928963666
24212392483532341359464345246157545635726865674683
24611235323572234643468334575457944568656815567976
42365327415347643852645875496375698651748671976285
23142496323425351743453646285456475739656758684176
34221556924533266713564437782467554889357866599146
33859739644496184175551729528666283163977739427418
35135958944624616915573572712668468382377957949348
43587335415469844652657195576376821668748793277985
58262537826937364893714847591482595861259361697236
96856393331796741444281785255539289636664139174777
35323413594643452461575456357268656746837976785794
35722346434683345754579445686568155679767926678187
53476438526458754963756986517486719762859782187396
34253517434536462854564757396567586841767869795287
45332667135644377824675548893578665991468977611257
44961841755517295286662831639777394274188841538529
46246169155735727126684683823779579493488168151459
54698446526571955763768216687487932779859814388196
69373648937148475914825958612593616972361472718347
17967414442817852555392896366641391747775241285888
46434524615754563572686567468379767857948187896815
46833457545794456865681556797679266781878137789298
64587549637569865174867197628597821873961893298417
45364628545647573965675868417678697952878971816398
56443778246755488935786659914689776112579188722368
55172952866628316397773942741888415385299952649631
57357271266846838237795794934881681514599279262561
65719557637682166874879327798598143881961925499217
71484759148259586125936169723614727183472583829458
28178525553928963666413917477752412858886352396999
57545635726865674683797678579481878968159298917926
57944568656815567976792667818781377892989248891319
75698651748671976285978218739618932984172914319528
56475739656758684176786979528789718163989182927419
67554889357866599146897761125791887223681299833479
The total risk of this path is 315 (the starting position is still never entered, so its risk is not counted).

Using the full map, what is the lowest total risk of any path from the top left to the bottom right?
 */

// Test on new test input:
// const testInput2 = fs.readFileSync('./input/day15_test2.txt', 'utf-8');
// console.log(minRisk(testInput, true)); // 315 Looks ok

// Brute force djikstras on the larger sized cave
// Takes around 250 seconds to complete (250k nodes to explore)
// Could possibly be sped up by using a priority queue to hold the next nodes to explore,
// rather than having to search the grid for them each time
console.log(
  'Part 2 Answer: Lowest Risk Path across large graph',
  minRisk(input, true, true)
); // 2925
