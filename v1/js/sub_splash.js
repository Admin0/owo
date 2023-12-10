function splash_animation_end() {
    document.querySelectorAll('.sp_item').forEach((e, i) => {
        e.innerHTML = i == 0 ? 'O' : i == 1 ? 'w' : 'O'
    })
    document.querySelector('#splash').style.display = 'none';
    localStorage.setItem("splash_viewed", "true");
}

if (localStorage.getItem("splash_viewed") == "true") {
    splash_animation_end();
} else {
    document.querySelector('#splash').innerHTML = '<div id="sp_box"><span class="sp_item"  id="eye_r">Off </span><span class="sp_item" id="mouth">work </span><span class="sp_item"  id="eye_l">On-time</span></div>';

    let splash_animation_time = 1000;

    document.querySelectorAll('#splash .sp_item').forEach((e, i) => {
        // console.log(e.offsetWidth);
        e.animate([
            { width: `${e.offsetWidth}px` },
            { width: i == 0 ? '35px' : i == 1 ? '38px' : '35px' }
        ], {
            duration: 1000,
            delay: splash_animation_time,
        })
        setTimeout(() => {
            e.style.width = i == 0 ? '35px' : i == 1 ? '38px' : '35px'
        }, splash_animation_time);
        setTimeout(() => {
            e.innerHTML = i == 0 ? 'O' : i == 1 ? 'w' : 'O'
        }, splash_animation_time + 1000);
    });
    setTimeout(() => {
        document.querySelectorAll('.sp_item').forEach((e, i) => {
            e.innerHTML = i == 0 ? 'U' : i == 1 ? 'w' : 'U'
        })
    }, splash_animation_time += 1500);
    setTimeout(() => {
        document.querySelectorAll('.sp_item').forEach((e, i) => {
            e.innerHTML = i == 0 ? 'O' : i == 1 ? 'w' : 'O'
        })
    }, splash_animation_time += 500);

    splash_animation_time += 500;


    // fadeout
    document.querySelector('#splash').animate([
        { opacity: 1 },
        { opacity: 0 },
    ], { duration: 1000, delay: splash_animation_time });
    splash_animation_time += 1000;


    setTimeout(() => {
        splash_animation_end();
    }, splash_animation_time);

    document.querySelector('#splash').onclick = function (e) {
        splash_animation_end();
    };

}