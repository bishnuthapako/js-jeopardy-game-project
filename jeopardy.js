// categories is the main data structure for the app; it looks like this:

const $start = $("#start");

$start.click(function(){

})





//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
const NUM_CATEGORIES = 6;

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
   const res = await axios.get("https://jservice.io/api/categories?count=100");
  shuffleTheArray(res.data);
  return res.data.map(c => c.id).splice(1,NUM_CATEGORIES);
}

function shuffleTheArray(arr) {
    arr.forEach((val, key) => {
        randomIndex = Math.ceil(Math.random()*(key + 1));
        arr[key] = arr[randomIndex];
        arr[randomIndex] = val;
      });
}

// const NUM_CATEGORIES = 10;
// const categoryId = [];
// const response = await axios.get(`http://jservice.io/api/clues?count=${NUM_CATEGORIES}`);
// console.log(response, 'res')
// return response.data.forEach(cateagory=> categoryId.push(cateagory.id))


/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    const cat = await axios.get(`https://jservice.io/api/category?id=${catId}`);
    shuffleTheArray(cat.data.clues);
    const cl = cat.data.clues.splice(0, 2);
        console.log(cl, 'clue')
    return {
        title: cat.data.title,
        clues: {question: cl.question, answer: cl.answer, showing: null }
    }
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
}

/** Handle clicking on a clue: show the question or answer.
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    const categoryIds = await getCategoryIds();
    categoryIds.forEach(async id => {
        const cat = await getCategory(id);
        console.log(cat, 'cat');
    })
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO