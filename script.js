document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  const toggleBtn = document.getElementById("toggleBtn");
  const headline = document.getElementById("headline");
  const description = document.getElementById("description");
  const notes = document.querySelectorAll(".note");
  const staff = document.querySelector(".staff");

  let improvisationActive = false;
  let animationFrameId = null;


  const improvColors = [
    "color-gold",
    "color-pink",
    "color-blue",
    "color-teal",
    "color-cream",
  ];

 
  const perfectPositions = [];

 
  function savePerfectPositions() {
    notes.forEach((note, i) => {
      const rect = note.getBoundingClientRect();
      perfectPositions[i] = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        size: parseFloat(window.getComputedStyle(note).fontSize),
        rotation: 0,
      };

      note.style.transform = "";
      note.style.position = "static";
      note.style.left = "";
      note.style.top = "";
      note.style.fontSize = "";
      note.style.transition = "transform 2s ease, color 2s ease";
    });
  }


  function getRandomPosition(index) {
    const margin = 80;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
  
    const x = Math.random() * (vw - 2 * margin) + margin;
    const y = vh / 2 + (Math.random() - 0.5) * 200;

    const rotation = (Math.random() * 60) - 30;
  
    const scale = 0.8 + Math.random() * 0.5;
    return { x, y, rotation, scale };
  }


  function activateImprovisation() {
    improvisationActive = true;
    app.classList.add("improvisation");
    app.classList.remove("perfection");


    headline.textContent = "FIND YOUR OWN RHYTHM.";
    description.textContent = "Experiment. Explore. Express.";
    toggleBtn.textContent = "RETURN TO ORDER.";
    toggleBtn.setAttribute("aria-pressed", "true");

 
    staff.style.transition = "opacity 2s ease";
    staff.style.opacity = "0";

    notes.forEach((note, i) => {
     
      note.classList.remove("color-gold", "color-pink", "color-blue", "color-teal", "color-cream");
      note.classList.add(improvColors[i]);

      note.style.position = "absolute";

  
      const { x, y, rotation, scale } = getRandomPosition(i);
      note.style.left = `${x}px`;
      note.style.top = `${y}px`;
      note.style.fontSize = `${scale * 6}rem`;
      note.style.transform = `rotate(${rotation}deg)`;

    
      note.style.animation = "none";
      note.style.transition = "none";
    });

   
    startNoteMovement();
  }


  let movementData = [];

  function startNoteMovement() {
    movementData = [];
    notes.forEach((note) => {

      movementData.push({
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vr: (Math.random() - 0.5) * 0.05,
        x: parseFloat(note.style.left),
        y: parseFloat(note.style.top),
        rotation: parseFloat(note.style.transform.match(/rotate\((-?\d+\.?\d*)deg\)/)?.[1] || 0),
        scale: parseFloat(note.style.fontSize) / 16, 
      });
    });

    function animate() {
      movementData.forEach((data, i) => {

        data.x += data.vx;
        data.y += data.vy;
        data.rotation += data.vr;

  
        const margin = 60;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        if (data.x < margin) data.vx = Math.abs(data.vx);
        if (data.x > vw - margin) data.vx = -Math.abs(data.vx);
        if (data.y < margin) data.vy = Math.abs(data.vy);
        if (data.y > vh - margin) data.vy = -Math.abs(data.vy);


        notes[i].style.left = `${data.x}px`;
        notes[i].style.top = `${data.y}px`;
        notes[i].style.transform = `rotate(${data.rotation}deg) scale(${data.scale})`;
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);
  }


  function stopNoteMovement() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }


  function deactivateImprovisation() {
    improvisationActive = false;
    app.classList.remove("improvisation");
    app.classList.add("perfection");

    headline.textContent = "EVERY NOTE IN ITS PLACE.";
    description.textContent = "Order. Precision. Repetition.";
    toggleBtn.textContent = "BREAK THE RULES.";
    toggleBtn.setAttribute("aria-pressed", "false");


    staff.style.opacity = "1";

    stopNoteMovement();


    notes.forEach((note, i) => {
  
      note.classList.remove(...improvColors);
      note.style.position = "static";
      note.style.left = "";
      note.style.top = "";
      note.style.fontSize = "";
      note.style.animation = "pulse 3s ease-in-out infinite";
      note.style.transition = "transform 2s ease, color 2s ease";
      note.style.transform = "";
      note.style.color = ""; 
    });
  }


  function toggleState() {
    if (improvisationActive) {
      deactivateImprovisation();
    } else {
      activateImprovisation();
    }
  }


  savePerfectPositions();


  toggleBtn.addEventListener("click", toggleState);


  toggleBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleState();
    }
  });


  window.addEventListener("resize", () => {
    if (!improvisationActive) {
      savePerfectPositions();
    }
  });
});
