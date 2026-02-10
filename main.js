/**
 * Zoorld Feedback Form
 * Professional JavaScript File
 */

$(document).ready(function() {
    initFormValidation();
    initStarRating();
    initCharCounter();
    initFormSubmission();
    initAnimations();
});

/**
 * Form Validation
 */
function initFormValidation() {
    const form = $('#feedbackForm');
    const patterns = {
        name: /^[a-zA-Z\s]{2,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    };
    
    // Validate name on blur
    $('#fullName').on('blur', function() {
        validateField($(this), patterns.name, 'Name should be 2-50 letters only');
    });
    
    $('#fullName').on('input', function() {
        if ($(this).hasClass('is-invalid')) {
            validateField($(this), patterns.name, 'Name should be 2-50 letters only');
        }
    });
    
    // Validate email on blur
    $('#email').on('blur', function() {
        validateField($(this), patterns.email, 'Please enter a valid email address');
    });
    
    $('#email').on('input', function() {
        if ($(this).hasClass('is-invalid')) {
            validateField($(this), patterns.email, 'Please enter a valid email address');
        }
    });
    
    // Validate dropdown on change
    $('#visitType').on('change', function() {
        const value = $(this).val();
        const errorEl = $('#visitError');
        
        if (!value) {
            $(this).addClass('is-invalid');
            errorEl.text('Please select a visit type').show();
        } else {
            $(this).removeClass('is-invalid');
            errorEl.text('').hide();
        }
    });
    
    // Validate rating on change
    $('input[name="rating"]').on('change', function() {
        $('#ratingError').text('').hide();
    });
    
    // Validate message on blur
    $('#feedbackMessage').on('blur', function() {
        validateMessage($(this));
    });
    
    $('#feedbackMessage').on('input', function() {
        if ($(this).hasClass('is-invalid')) {
            validateMessage($(this));
        }
    });
    
    // Validate recommendation on change
    $('input[name="recommend"]').on('change', function() {
        $('#recommendError').text('').hide();
    });
    
    function validateField($field, pattern, errorMsg) {
        const value = $field.val().trim();
        const errorEl = $field.closest('.input-wrapper').find('.error-tooltip');
        
        if (value === '') {
            $field.removeClass('is-invalid');
            errorEl.text('').hide();
            return false;
        }
        
        if (!pattern.test(value)) {
            $field.addClass('is-invalid');
            errorEl.text(errorMsg).show();
            return false;
        } else {
            $field.removeClass('is-invalid');
            errorEl.text('').hide();
            return true;
        }
    }
    
    function validateMessage($field) {
        const value = $field.val().trim();
        const errorEl = $field.closest('.textarea-wrapper').find('.error-tooltip');
        
        if (value === '') {
            $field.removeClass('is-invalid');
            errorEl.text('').hide();
            return false;
        }
        
        if (value.length < 10) {
            $field.addClass('is-invalid');
            errorEl.text('Please provide more details (at least 10 characters)').show();
            return false;
        } else if (value.length > 500) {
            $field.addClass('is-invalid');
            errorEl.text('Message is too long (maximum 500 characters)').show();
            return false;
        } else {
            $field.removeClass('is-invalid');
            errorEl.text('').hide();
            return true;
        }
    }
    
    // Store for form submission
    window.feedbackValidator = {
        validateField,
        validateMessage
    };
}

/**
 * Star Rating
 */
function initStarRating() {
    const ratingTexts = {
        1: 'Poor - Very disappointed',
        2: 'Fair - Could be better',
        3: 'Good - Satisfied',
        4: 'Very Good - Enjoyed it',
        5: 'Excellent - Absolutely amazing!'
    };
    
    const $ratingText = $('#ratingText');
    
    $('input[name="rating"]').on('change', function() {
        const rating = $(this).val();
        $ratingText.text(ratingTexts[rating]);
    });
    
    // Add scale animation on hover
    $('input[name="rating"]').on('mouseenter', function() {
        const rating = $(this).val();
        $ratingText.text(ratingTexts[rating]).css({
            'opacity': '1',
            'transform': 'scale(1.05)'
        });
    });
    
    $('input[name="rating"]').on('mouseleave', function() {
        const checkedRating = $('input[name="rating"]:checked').val();
        if (checkedRating) {
            $ratingText.text(ratingTexts[checkedRating]).css('transform', 'scale(1)');
        } else {
            $ratingText.css('opacity', '0');
        }
    });
}

/**
 * Character Counter
 */
function initCharCounter() {
    const $message = $('#feedbackMessage');
    const $current = $('#charCurrent');
    const maxLength = 500;
    
    $message.on('input', function() {
        const length = $(this).val().length;
        $current.text(length);
    });
}

/**
 * Form Submission
 */
function initFormSubmission() {
    const form = $('#feedbackForm');
    const submitBtn = $('#submitBtn');
    const successMessage = $('#successMessage');
    const resetBtn = $('#resetBtn');
    
    form.on('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate all fields
        if (!window.feedbackValidator.validateField($('#fullName'), /^[a-zA-Z\s]{2,50}$/, 'Name should be 2-50 letters only')) {
            isValid = false;
        }
        
        if (!window.feedbackValidator.validateField($('#email'), /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address')) {
            isValid = false;
        }
        
        const visitType = $('#visitType').val();
        if (!visitType) {
            $('#visitType').addClass('is-invalid');
            $('#visitError').text('Please select a visit type').show();
            isValid = false;
        }
        
        if (!$('input[name="rating"]:checked').val()) {
            $('#ratingError').text('Please select a rating').show();
            isValid = false;
        }
        
        if (!window.feedbackValidator.validateMessage($('#feedbackMessage'))) {
            isValid = false;
        }
        
        if (!$('input[name="recommend"]:checked').val()) {
            $('#recommendError').text('Please select an option').show();
            isValid = false;
        }
        
        if (!isValid) {
            form.addClass('shake');
            setTimeout(function() {
                form.removeClass('shake');
            }, 500);
            
            $('input.is-invalid, select.is-invalid, textarea.is-invalid').first().focus();
            return;
        }
        
        // Show loading state
        submitBtn.addClass('loading').prop('disabled', true);
        
        // Simulate submission
        setTimeout(function() {
            form.fadeOut(400, function() {
                successMessage.addClass('show');
                successMessage.hide().fadeIn(500);
                createSuccessParticles();
            });
            
            submitBtn.removeClass('loading').prop('disabled', false);
        }, 1500);
    });
    
    resetBtn.on('click', function() {
        successMessage.removeClass('show').hide();
        form[0].reset();
        $('#charCurrent').text('0');
        $('#ratingText').text('').css('opacity', '0');
        form.fadeIn(400);
    });
}

/**
 * Success Particles
 */
function createSuccessParticles() {
    const colors = ['#8b7355', '#d35400', '#3d7a5f', '#5d4037'];
    const container = $('.success-icon');
    
    for (let i = 0; i < 25; i++) {
        const particle = $('<div class="success-particle"></div>');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 4;
        const left = Math.random() * 100;
        const animDuration = Math.random() * 1000 + 800;
        
        particle.css({
            'position': 'absolute',
            'width': size + 'px',
            'height': size + 'px',
            'background': color,
            'border-radius': '50%',
            'left': left + '%',
            'top': '50%',
            'opacity': '0',
            'pointer-events': 'none'
        });
        
        container.append(particle);
        
        particle.animate({
            'top': (Math.random() * 120 + 40) + '%',
            'left': (Math.random() * 140 - 20) + '%',
            'opacity': '0',
            'transform': 'scale(0)'
        }, animDuration, function() {
            particle.remove();
        });
    }
    
    if (!$('#particleStyles').length) {
        $('head').append('<style id="particleStyles">.success-particle{transition: all 1.5s ease-out;}</style>');
    }
}

/**
 * Animations
 */
function initAnimations() {
    // Focus animations for inputs
    $('.form-control, .form-select').on('focus', function() {
        $(this).closest('.form-group').addClass('focused');
    });
    
    $('.form-control, .form-select').on('blur', function() {
        $(this).closest('.form-group').removeClass('focused');
    });
    
    // Button hover effects
    $('.btn-submit').on('mouseenter', function() {
        $(this).css('transform', 'translateY(-3px)');
    });
    
    $('.btn-submit').on('mouseleave', function() {
        $(this).css('transform', '');
    });
    
    // Checkbox hover animation
    $('.checkbox-label').on('mouseenter', function() {
        $(this).css('transform', 'translateY(-2px)');
    });
    
    $('.checkbox-label').on('mouseleave', function() {
        $(this).css('transform', '');
    });
    
    // Recommendation buttons hover
    $('.btn-recommend').on('mouseenter', function() {
        $(this).css('transform', 'translateY(-3px)');
    });
    
    $('.btn-recommend').on('mouseleave', function() {
        $(this).css('transform', '');
    });
}

/**
 * Console Welcome
 */
console.log('%c🦁 Zoorld Feedback Form 🦁', 'font-size: 18px; color: #8b7355; font-weight: bold;');

/* ==========================================================================
   END OF Feedback Form JavaScript
   ========================================================================== */
