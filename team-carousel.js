 function toggleLike(button) {
            const span = button.querySelector('span');
            const icon = button.querySelector('i');
            let count = parseInt(span.textContent);
            
            if (button.classList.contains('liked')) {
                // Unlike
                button.classList.remove('liked');
                count--;
                icon.classList.remove('fas');
                icon.classList.add('far');
            } else {
                // Like
                button.classList.add('liked');
                count++;
                icon.classList.remove('far');
                icon.classList.add('fas');
                
                // Add a little animation
                icon.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1)';
                }, 200);
            }
            
            span.textContent = count;
        }

        // Optional: Pause carousel on hover
        document.getElementById('teamCarousel').addEventListener('mouseenter', function() {
            bootstrap.Carousel.getInstance(this).pause();
        });
        
        document.getElementById('teamCarousel').addEventListener('mouseleave', function() {
            bootstrap.Carousel.getInstance(this).cycle();
        });