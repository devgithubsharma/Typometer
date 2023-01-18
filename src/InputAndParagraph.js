import React from "react";
import "./App.css";
import { useState, useEffect} from "react";
import "./index.css";

function Word(props) {
  const { text, active, correct, isGenerated } = props;

  if(isGenerated) {

    if (active) {
      return <span className="active">{text} </span>;
    }

    return <span>{text} </span>;

  } else {

    if (correct === 1) {
      return <span className="correct">{text} </span>;
    }

    if (correct === 2) {
      return <span className="incorrect">{text} </span>;
    }

    if (active) {
      return <span className="active">{text} </span>;
    }

    return <span>{text} </span>;

  }
};

function Timer(props){
  const {startCounting, currentTime, setTime} = props;
  useEffect(()=>{
    if(startCounting) {
      setTimeout(()=>{
       setTime(currentTime+1);
      },1000);
    } else {
      setTime(0);
    }
  });

  return <h3 align="left">Speed: {currentTime} </h3>
}
// Word=React.memo(Word);

function InputAndParagraph() {
  const [para, setPara] = useState("");
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  //const [correctwordarray, setcorrectwordarray] = useState([]);
  const [highlightedWordArray, setHighlightedWordArray] = useState([]);
  const [startCounting, setStartCounting] =  useState(false);
  const [timeElasped, setTimeElasped] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [backspaceFlag, setBackspaceFlag] = useState(false);
  const [inputBeforeBackspace, setInputBeforeBackspace] = useState("");
  const [correctWordCount, setCorrectWordCount] = useState(0);
  const [inCorrectWordCount, setInCorrectWordCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function processInput(value) {
    if(!startCounting){
      setStartCounting(true);
    }

    var input = document.getElementById('isEmpty');
    var colorArray;
    setBackspaceFlag(false);

    input.onkeydown = function(event) {
        var key = event.keyCode || event.charCode;
        if(key === 8 || key === 46) {
          console.log("Backspace pressed");
          setBackspaceFlag(true);
        } 
    };
    
    if(!backspaceFlag) {
      setInputBeforeBackspace(value);
      //console.log(inputBeforeBackspace);
    }

    if ((inputBeforeBackspace.endsWith(' ') || value.endsWith(' ')) && backspaceFlag) {

      if(inputBeforeBackspace.endsWith('  ')) {
        setActiveWordIndex((index) => index - 1);
        setInputBeforeBackspace(value);
        colorArray = highlightedWordArray;
        console.log("length = "+ colorArray.length);
        colorArray[activeWordIndex - 1] = 0;
        setHighlightedWordArray(colorArray)
        return;
      }

      if(value.endsWith(' ')) {
        setInputBeforeBackspace(value);
        return;
      }

      setActiveWordIndex((index) => index - 1);
      console.log(activeWordIndex);
      console.log(highlightedWordArray);
      setInputBeforeBackspace(value);
      setBackspaceFlag(false);

      colorArray = highlightedWordArray;
      console.log("length = "+colorArray.length);
      colorArray[activeWordIndex - 1] = 0;
      setHighlightedWordArray(colorArray)

    } else if (value.endsWith(' ')) {

      setActiveWordIndex((index) => index + 1);
      console.log(activeWordIndex);
      console.log(highlightedWordArray);

      const word = value.trim();
      colorArray = highlightedWordArray;
      console.log("length = "+colorArray.length);
      colorArray.push(0);
      //setHighlightedWordArray(colorArray)
      const compareWords = word.split(' ');
      if(compareWords[compareWords.length - 1] === words[activeWordIndex]) {
        colorArray[activeWordIndex] = 1;
      } else {
        colorArray[activeWordIndex] = 2;
      }
      setHighlightedWordArray(colorArray);

    }
  }

  // Generate Paragraphs
  const para1 = `An aim is a goal or objective to achieve in life. In order to succeed in life, one must have a goal. My aim in life is to be a teacher. Teaching is a noble and responsible profession. I have come to know that the ever-increasing misery and distress, are due to the ignorance and illiteracy of the people of our country. So I have to spread education among the masses as much as possible within my humble power.`;

  const para2 = `Human life is a mixture of weal and woe, smiles and tears. However, once what had seemed to be a memorable day turned out to be the saddest day of my life. We had planned for a picnic with all our classmates after the examination on the bank of the river Ganga. We started early in the morning and reached at 10 am. After the cooking was completed, we wished to take a bath in the Ganga`;

  const paras = [para1, para2];

  function randomNumberGenerator(min, max) {
    let x = Math.floor(Math.random() * max + min);
    return x;
  }

  function randomParagraph() {
    setPara(paras[randomNumberGenerator(0, 2)]);
    setActiveWordIndex(0);
    setHighlightedWordArray([]);
    // setidx(props.idx=0)
    // console.log(para);
    // const words = para.split(' ');
    setCorrectWordCount(0);
    setInCorrectWordCount(0);
    setStartCounting(false);
    setIsSubmitted(false);
    const textarea = document.getElementById('isEmpty');
    textarea.value = '';
  }

  function Submit(){
    setTimeTaken(timeElasped);
    setStartCounting(false);
    setIsSubmitted(true);
    setCorrectWordCount(0);
    setInCorrectWordCount(0);

    for (let num of highlightedWordArray) {
      if(num===1){
        setCorrectWordCount((count) => count + 1);
      }
      if(num===2){
        setInCorrectWordCount((count) => count + 1);
      }

    }
    // console.log("correctWord = "+correctWordCount)
    // console.log("Time = "+timeElasped)
  }

  function DisplayMetrics(props) {
    if(props.checkSubmit) {
      return (
        <div>
          <h3 align="center"> Speed : {Math.floor(((correctWordCount + inCorrectWordCount) / timeTaken)*60)} </h3>
          <h3 align="center"> Accuracy : {parseFloat((correctWordCount / (correctWordCount + inCorrectWordCount))*100).toFixed(2)} </h3>
          <h3 align="center"> Correct Word : {correctWordCount} </h3>
          <h3 align="center"> Incorrect Word : {inCorrectWordCount} </h3>
        </div>
      )
    }
  }

  const words = para.split(" ");
  return (
    <div className="para">
      <h1>Typometer</h1>
      <Timer 
      startCounting = {startCounting}
      currentTime = {timeElasped}
      setTime = {setTimeElasped}
      />
      <button onClick={randomParagraph}>Generate Paragraph</button>
      <p>
        {words.map((word, index) => {
          // console.log(correctwordarray[index]);
          return (
            <Word
              text = {word}
              active = {index === activeWordIndex}
              correct = {highlightedWordArray[index]}
              isGenerated = {activeWordIndex === 0 ? true : false}  
            />
          );
        })};
      </p>

      <br /> <br />

      <textarea
        id="isEmpty"
        className="textregion"
        name="textarea"
        rows="15"
        cols="95"
        placeholder="Enter your text"
        autoComplete="off"
        onChange={(e) => processInput(e.target.value)}
      ></textarea><br></br><br></br>
      <button onClick={Submit}>Submit</button>
      <DisplayMetrics 
      checkSubmit = {isSubmitted}
      />
    </div>
  );
}

export default InputAndParagraph;