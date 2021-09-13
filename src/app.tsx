import React from 'react';
import { render } from 'react-dom';
import circle from "./assets/circle.jpg";
import "./style.scss";

render(<div>
        <h1>test</h1>
        <img src={circle} alt="" />
       </div>,
        document.getElementById('root'));
