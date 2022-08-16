(() => {
  "use strict";
  const wrapper = document.querySelector(".wrapper");
  const btnSetting = document.querySelector(".menu__setting");
  const menuSubSetting = document.querySelector(".menu__subsetting");
  const btnClose = document.querySelector(".btn-close");
  const btnOk = document.querySelector(".subsett__btn");
  const btnClock = document.querySelector(".clock__btn");
  const mainTime = document.querySelector("#time-0");
  const shortTime = document.querySelector("#time-1");
  const longTime = document.querySelector("#time-2");
  const intervalTime = document.querySelector("#interval");
  const watch = document.querySelector(".clock__time");
  document.querySelector(".clock__time-active");
  const clockSteps = document.querySelector(".clock__steps");
  const clockStep = document.querySelectorAll(".clock__step");
  const title = document.querySelector("title");
  document.querySelector(".taskList__form");
  document.querySelector(".taskList__add");
  const audio = new Audio("/audio/audio.mp3");
  const audioVol = document.querySelector(".audioVol__vol");
  let seconds;
  let watchNum = 0;
  let mainCount = 1;
  let personCount = intervalTime.value;
  let grayCount = intervalTime.value;
  let blueCount = 0;
  let vol = 0;
  const times = {
    0: 1500,
    1: 300,
    2: 900,
  };

  ///Create Task
  const form = document.querySelector("#task__form");
  const input = document.querySelector("#task__input");
  const listEl = document.querySelector("#tasks");
  let wordsBase;
  if (localStorage.getItem("wordBase")) {
    wordsBase = JSON.parse(localStorage.getItem("wordBase"));
  } else {
    wordsBase = [];
  }

  const createTask = function (word) {
    const taskEl = document.createElement("div");
    const taskContentEl = document.createElement("div");
    const taskCheck = document.createElement("input");
    const taskInput = document.createElement("input");
    const taskActions = document.createElement("div");
    const btnEdit = document.createElement("button");
    const btnDelete = document.createElement("button");
    taskEl.classList.add("task");
    taskContentEl.classList.add("task__content");
    taskCheck.classList.add("check");
    taskCheck.type = "checkbox";
    taskInput.classList.add("text");
    taskInput.type = "text";
    taskInput.setAttribute("readonly", "readonly");
    taskActions.classList.add("task__actions");
    btnEdit.classList.add("edit");
    btnEdit.textContent = "Edit";
    btnDelete.classList.add("delete");
    btnDelete.textContent = "Delete";

    let task;
    if (input.value) {
      task = input.value;
    } else {
      task = word;
    }
    taskInput.value = task;
    if (!task) {
      alert("Please fill out the task");
      return;
    }
    if (task !== word) {
      if (wordsBase) wordsBase.push(task);
    }
    console.log(wordsBase);

    taskContentEl.appendChild(taskCheck);
    taskContentEl.appendChild(taskInput);
    taskActions.appendChild(btnEdit);
    taskActions.appendChild(btnDelete);
    taskEl.appendChild(taskContentEl);
    taskEl.appendChild(taskActions);
    listEl.appendChild(taskEl);
    input.value = "";

    ///Work with Task
    btnEdit.addEventListener("click", (e) => {
      e.preventDefault();
      if ("edit" === btnEdit.textContent.toLowerCase()) {
        taskInput.removeAttribute("readonly");
        taskInput.focus();
        btnEdit.textContent = "Save";
      } else if ("save" === btnEdit.textContent.toLowerCase()) {
        let targetText =
          e.target.parentNode.parentNode.firstChild.lastChild.value;
        taskInput.setAttribute("readonly", "readonly");
        btnEdit.textContent = "Edit";
        document.querySelectorAll(".task").forEach((item, i) => {
          let inputWord = item.firstChild.lastChild.value;
          if (targetText === inputWord) {
            wordsBase[i] = inputWord;
          }
        });
        addLocal();
      }
    });
    addLocal();
    btnDelete.addEventListener("click", (e) => {
      e.preventDefault();
      wordsBase.forEach((item, i) => {
        let targetText =
          e.target.parentNode.parentNode.firstChild.lastChild.value;
        if (item === targetText) {
          wordsBase.splice(i, 1);
        }
      });
      listEl.removeChild(taskEl);
      addLocal();
    });
    taskCheck.addEventListener("click", (e) => {
      if (taskCheck.checked) taskInput.classList.add("lt");
      else taskInput.classList.remove("lt");
    });
  };

  ///Work with timer
  const changeColor = function (addColor, removeColor1, removeColor2) {
    document.body.classList.remove(removeColor1, removeColor2);
    document.body.classList.add(addColor);
    btnClock.classList.remove(
      `clock__btn-${removeColor1}`,
      `clock__btn-${removeColor2}`
    );
    btnClock.classList.add(`clock__btn-${addColor}`);
  };
  const templateTime = function (time) {
    const min = Math.trunc(Math.abs(time) / 60);
    const sec = Math.trunc(time % 60);
    watch.textContent = `${String(min).padStart(2, "0")}:${String(sec).padStart(
      2,
      "0"
    )}`;
  };

  audioVol.addEventListener("change", (e) => {
    audio.volume = Number(`0.${audioVol.value}`);
    audio.play();
  });
  const audioVolum = function () {
    audio.volume = Number(`0.${vol}`);
    audio.play();
  };
  const changeTimeBlock = function (
    tNum,
    addColor,
    removeColor1,
    removeColor2
  ) {
    templateTime(times[tNum]);
    changeColor(addColor, removeColor1, removeColor2);
  };
  const btnTimeStop = function () {
    if ("stop" === btnClock.dataset.start) {
      btnClock.textContent = "Start";
      btnClock.dataset.start = "start";
      clearInterval(interval);
    }
  };
  function reloadSeconds(num) {
    seconds = Math.abs(times[num]);
  }
  const stepClock = function (i, color1, color2, color3) {
    audioVolum();
    changeTimeBlock(i, color1, color2, color3);
    watchNum = watch.dataset.clock = i;
    reloadSeconds(watchNum);
    btnTimeStop();
    clockStep.forEach((item) => {
      item.classList.remove("clock__step-active");
      if (i === Number(item.dataset.name))
        item.classList.add("clock__step-active");
    });
  };
  reloadSeconds(watchNum);
  const timer = function () {
    title.textContent = `${watch.innerText} - your Time`;
    if (seconds > 0) {
      seconds -= 1;
      templateTime(seconds);
      if (seconds <= 0 && mainCount % grayCount === 0) {
        grayCount += personCount;
        if (blueCount !== mainCount) blueCount++;
        stepClock(2, "gray", "red", "blue");
      }
      if (seconds <= 0 && mainCount === blueCount) {
        mainCount++;
        stepClock(0, "red", "blue", "gray");
      }
      if (seconds <= 0) {
        blueCount++;
        stepClock(1, "blue", "red", "gray");
      }
    }
  };
  btnSetting.addEventListener("click", (e) => {
    e.preventDefault();
    menuSubSetting.style.display = "block";
  });
  btnClose.addEventListener("click", (e) => {
    e.preventDefault();
    menuSubSetting.style.display = "none";
  });
  let interval;
  btnClock.addEventListener("click", (e) => {
    e.preventDefault();
    const target = e.target;
    if ("start" === target.dataset.start) {
      target.textContent = "Stop";
      target.dataset.start = "stop";
      interval = setInterval(timer, 1e3);
    } else if ("stop" === target.dataset.start) {
      target.textContent = "Start";
      target.dataset.start = "start";
      clearInterval(interval);
    }
  });
  btnOk.addEventListener("click", (e) => {
    e.preventDefault();
    vol = Number(audioVol.value);
    times[0] = 60 * mainTime.value;
    times[1] = 60 * shortTime.value;
    times[2] = 60 * longTime.value;
    menuSubSetting.style.display = "none";
    clockStep.forEach((item, i) => {
      item.classList.remove("clock__step-active");
      if (0 === i) {
        item.classList.add("clock__step-active");
        watch.dataset.clock = i;
      }
    });
    watchNum = 0;
    personCount = Number(intervalTime.value);
    grayCount = Number(intervalTime.value);
    mainCount = 1;
    blueCount = 0;
    templateTime(times[0]);
    changeColor("red", "blue", "gray");
    btnTimeStop();
    reloadSeconds(watchNum);
  });
  clockSteps.addEventListener("click", (e) => {
    e.preventDefault();
    const target = e.target;
    clockStep.forEach((item) => {
      item.classList.remove("clock__step-active");
    });
    target.classList.add("clock__step-active");
    watchNum = Number((watch.dataset.clock = target.dataset.name));
    reloadSeconds(watchNum);
    btnTimeStop();
    if (0 === watchNum) changeTimeBlock(0, "red", "blue", "gray");
    if (1 === watchNum) changeTimeBlock(1, "blue", "red", "gray");
    if (2 === watchNum) changeTimeBlock(2, "gray", "blue", "red");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    createTask();

    wrapper.scrollIntoView({ behavior: "smooth", block: "end" });
  });

  if (wordsBase) {
    wordsBase.forEach((item) => {
      createTask(item);
    });
  }

  function addLocal() {
    const setStringBase = JSON.stringify(wordsBase);
    localStorage.setItem("wordBase", setStringBase);
  }
})();
