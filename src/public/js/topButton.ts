window.onscroll = function() { scrollFunction() };

function scrollFunction(): void {
    let btn: HTMLElement = document.getElementById("top-button") as HTMLElement;
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
}