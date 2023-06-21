// categories is the main data structure for the app; it looks like this:

const $start = $("#start");
const $jeopardy = $("#jeopardy");
const $tbody = $("tbody");
const $restart = $("#restart");

let currentClueIdx = 0;
let currentCategoryIdx = 0;


// $jeopardy.click(function(){
//     // console.log('clicked the jeopardy blue')
//     $("#answer").show()
// })




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
    const clues = cat.data.clues.splice(0, 2).map(clue=>({
        question: clue.question,
        answer: clue.answer,
        showing: null
    }));
        // console.log(clue[0].answer, 'answer')
    return {
        title: cat.data.title,
        clues: clues
        // clues: {question: clue.map(clue=> clue.question), answer: clue.map(clue=> clue.answer), showing: null }
    }
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable(cats) {
    // loop each category
    for (let i = 0; i < cats.length; i++) {
        const cat = cats[i];
        // console.log(cat, 'catI')

        //loop each clue
        for (let j = 0; j < cat.clues.length; j++) {
            const clue = cat.clues[j];
            console.log(clue, 'clu')
            
            // create q&a
            const qaContainer = document.createElement("div");
            qaContainer.classList.add("qa-container");
            const qaContent = `
                    <h3 class="display-6">${cat.title}</h3>
                    <h4 class="text-white mt-4" id="question-${i}-${j}">${clue.question}</h4>
                    <h4 id="answer-${i}-${j}" class="answer" style="display:none">${clue.answer}</h4>
            `;
            qaContainer.innerHTML = qaContent;
            qaContainer.style.display = "none";

            // Show the first one only
            if ( i === 0 && j === 0) {
                qaContainer.style.display = "block";
            }

            qaContainer.addEventListener("click", handleClick);
            $jeopardy.append(qaContainer)
        }
    }
  
//   currentClueIdx++;
//   console.log(currentClueIdx, 'currIdx');

//   if(currentClueIdx === cat.clues.length){
//     console.log("next category")
//   }

//                 $jeopardy.css("display", "block")
//                 // $start.css("display", "none")
//                 $("#heading").css("display", "none")

//     $jeopardy.append(updateData)
}

/** Handle clicking on a clue: show the question or answer.
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    console.log(evt.target.parentNode.childNodes[5], 'childnodes[5]')
    evt.target.parentNode.childNodes[5].style.display = "block"
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
    for (let i = 0; i < categoryIds.length; i++) {
        const cat = await getCategory(categoryIds[i]);
        categories.push(cat);
    }
    // console.log(categories)
    await fillTable(categories);
}

/** On click of start / restart button, set up game. */

$start.on("click", async function(){
    await setupAndStart()
    $jeopardy.show()
    // $("#answer").hide();
    // $jeopardy.on("click",handleClick)
   })



// TODO

/** On page load, add event handler for clicking clues */

// TODO



