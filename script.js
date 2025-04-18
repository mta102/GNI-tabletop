    const quizContainer = document.getElementById('quiz');
    const scoreContainer = document.getElementById('score');
    let score = 0;

  document.querySelectorAll('.intro-section').forEach(section => {
    const btn = section.querySelector('.toggleIntro');
    const text = section.querySelector('.introText');

    btn.addEventListener('click', () => {
      const isVisible = text.classList.toggle('show');
      btn.textContent = isVisible
        ? btn.textContent.replace('Show', 'Hide').replace('▼', '▲')
        : btn.textContent.replace('Hide', 'Show').replace('▲', '▼');
    });
  });



    function showQuestion(key) {
      const q = questions[key];
	//console.log(q);
      const block = document.createElement('div');
      block.className = 'question-block';
      
      
      const narrativeText = document.createElement('p');
      narrativeText.className = 'narrative';
      narrativeText.innerHTML = q.narrative;
      block.appendChild(narrativeText);


      const questionText = document.createElement('p');
      questionText.innerHTML = q.question;
      block.appendChild(questionText);

      q.answers.forEach(answer => {
        const btn = document.createElement('button');
        btn.textContent = answer.answer;
        btn.onclick = () => {
          score += answer.score;

          // Show selected answer
          const answerEl = document.createElement('div');
          answerEl.className = 'answer';
          answerEl.textContent = `You answered: ${answer.answer} (+${answer.score} points)`;
          block.appendChild(answerEl);

	 
	 const explainEl = document.createElement('div');
          explainEl.className = 'explain';
          explainEl.innerHTML = answer.explain;
          block.appendChild(explainEl);

	if (!answer.summary === ""){   
	const summaryEl = document.createElement('div');
          summaryEl.className = 'explain';
          summaryEl.innerHTML = answer.summary;
          block.appendChild(summaryEl);}

          // Disable all buttons in this block
          const allButtons = block.querySelectorAll('button');
          allButtons.forEach(b => b.disabled = true);

          // Continue to next question
          if (answer.next === "end") {
            showScore();
          } else {
            showQuestion(answer.next);
          }
        };
        block.appendChild(btn);
      });

      quizContainer.appendChild(block);
    }

    function showScore() {
      scoreContainer.textContent = `Your total score is: ${score}`;
    }



async function loadQuestions() {
  const response = await fetch('qa.csv');
  const data = await response.text();

  // Use PapaParse to handle quotes, commas, line breaks properly
  const parsed = Papa.parse(data, {
    header: true,
    skipEmptyLines: true
  });

  const questions = {};

  parsed.data.forEach(entry => {
    const id = entry.id.trim();

    if (!questions[id]) {
      questions[id] = {
        narrative: entry.narrative,
        question: entry.question,
        answers: []
      };
    }

    questions[id].answers.push({
      answer: entry.answer_text,
      explain: entry.explain_text,
      summary: entry.post_summary,
      score: parseInt(entry.score),
      next: entry.next
    });
  });

  return questions;
}



  (async function init() {
    questions = await loadQuestions();
    showQuestion("start");
  })();
