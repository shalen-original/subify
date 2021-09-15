document.addEventListener('DOMContentLoaded', function (): void {
    
      let $navbarBurgers: HTMLElement[]  = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
      if ($navbarBurgers.length > 0) {
    
        $navbarBurgers.forEach(function ($el: HTMLElement): void {
    
          // Add a click event
          $el.addEventListener('click', function (): void {
    
            // Get the target from the "data-target" attribute
            let target: string = $el.dataset.target||"";
            let $target: HTMLElement|null = document.getElementById(target);
    
            if ($target !== null) {
    
              // Toggle the class on both the "navbar-burger" and the "navbar-menu"
              $el.classList.toggle('is-active');
              $target.classList.toggle('is-active');
            }
          });
        });
      }
    });