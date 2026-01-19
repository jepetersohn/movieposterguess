import React from 'react';

function DifficultyControls({value, onChange}) {

    return(
       
        <div className="drawerBlock">
      <h3>Difficulty Level:</h3>
      <div>
        <input
          type="radio"
          name="difficulty"
          value="easy"
          checked={value === 'easy'}
          onChange={() => onChange("easy")}
        />
        <label htmlFor="easy">Easy</label>
      </div>
      <div>
        <input
          type="radio"
          id="medium"
          name="difficulty"
          value="medium"
          checked={value === 'medium'}
          onChange={() => onChange("medium")}
        />
        <label htmlFor="hard">Medium</label>
      </div>
      <div>
        <input
          type="radio"
          id="hard"
          name="difficulty"
          value="hard"
          checked={value === 'hard'}
          onChange={() => onChange("hard")}
        />
        <label htmlFor="option3">Hard</label>
      </div>
    </div>
    )
}

export default DifficultyControls;