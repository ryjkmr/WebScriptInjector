(function () {
  const videoElement = document.querySelector("video");
  let repeatTime_A = 0;
  let repeatTime_B = videoElement.duration;
  let enable_loop = false;
  console.log(repeatTime_A, repeatTime_B, enable_loop);

  console.log("A-B repeat bookmarklet is on");

  document.addEventListener("keydown", function (e) {
    if (e.target.tagName.toLowerCase() === 'input') {
      return; // input要素での入力中は何もしない
    }
    const now = videoElement.currentTime;
    console.log(e.key);
    if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
    switch (e.code) {
      case 'KeyA':
        repeatTime_A = now;
        if (now > repeatTime_B) repeatTime_B = videoElement.duration;
        enable_loop = true;
        console.log("repeat", repeatTime_A, repeatTime_B);
        break;
      case 'KeyB':
        repeatTime_B = now < 1 ? 1 : now;
        if (now <= repeatTime_A) repeatTime_A = 0;
        enable_loop = true;
        console.log("repeat", repeatTime_A, repeatTime_B);
        break;
      case 'KeyN':
        enable_loop = !enable_loop;
        console.log("repeat", enable_loop);
        break;
    }
  });

  videoElement.addEventListener("seeking", (e) => {
    const now = videoElement.currentTime;
    if (now > repeatTime_B || now < repeatTime_A) {
      enable_loop = false;
      console.log("repeat is off");
    } 
    // else {
    //   enable_loop = true;
    //   console.log("repeat is on");
    // }
  });

  videoElement.addEventListener("timeupdate", (e) => {
    const now = videoElement.currentTime;
    if (enable_loop) {
      if (now > repeatTime_B) {
        videoElement.currentTime = repeatTime_A;
      } else if (now < repeatTime_A) {
        videoElement.currentTime = repeatTime_A;
      }
    }
  });

})();
