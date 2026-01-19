import React from 'react';

function TypeControls({value, onChange}) {

    return(
       
        <div className="drawerBlock">
      <h3>Type:</h3>
      <div>
        <input
          type="radio"
          name="type"
          value="movie"
          checked={value === 'movie'}
          onChange={() => onChange("movie")}
        />
        <label htmlFor="movie">Movie</label>
      </div>
      <div>
        <input
          type="radio"
          name="type"
          value="actor"
          checked={value === 'actor'}
          onChange={() => onChange("actor")}
        />
        <label htmlFor="hard">Actor</label>
      </div>
    </div>
    )
}

export default TypeControls;