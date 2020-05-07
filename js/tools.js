$(document).ready(function() {

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7 \d{3} \d{3}\-\d{2}\-\d{2}$/);
        },
        'Ошибка заполнения'
    );

    $('body').on('focus', '.form-input input, .form-input textarea', function() {
        $(this).parent().addClass('focus');
    });

    $('body').on('blur', '.form-input input, .form-input textarea', function() {
        $(this).parent().removeClass('focus');
        if ($(this).val() != '') {
            $(this).parent().addClass('full');
        } else {
            $(this).parent().removeClass('full');
        }
    });

    $('body').on('input', '.form-input textarea', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    $('body').on('change', '.form-file input', function() {
        var curInput = $(this);
        var curField = curInput.parents().filter('.form-file');
        var curName = curInput.val().replace(/.*(\/|\\)/, '');
        if (curName != '') {
            curField.find('.form-file-name').html(curName);
        } else {
            curField.find('.form-file-name').html('');
        }
    });

    $('form').each(function() {
        initForm($(this));
    });

    $('.gallery').each(function() {
        var curGallery = $(this);
        curGallery.on('init', function(event, slick) {
            var curSlide = curGallery.find('.slick-current');
            var curPhotoHeight = curSlide.find('.gallery-item-photo').outerHeight();
            curGallery.find('.slick-dots').css({'top': curPhotoHeight});
            curGallery.find('.slick-prev').css({'top': curPhotoHeight / 2});
            curGallery.find('.slick-next').css({'top': curPhotoHeight / 2});
        });
        var options = {
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow: '<button type="button" class="slick-prev"></button>',
            nextArrow: '<button type="button" class="slick-next"></button>',
            adaptiveHeight: true,
            fade: true,
            dots: true
        };
        curGallery.slick(
            options
        ).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            var curSlide = curGallery.find('.slick-slide:not(.slick-cloned)').eq(nextSlide);
            var curPhotoHeight = curSlide.find('.gallery-item-photo').outerHeight();
            curGallery.find('.slick-dots').css({'top': curPhotoHeight});
            curGallery.find('.slick-prev').css({'top': curPhotoHeight / 2});
            curGallery.find('.slick-next').css({'top': curPhotoHeight / 2});
        });
    });

    $('.tabs').each(function() {
        var curTabs = $(this);
        var curTabsMenu = curTabs.find('> .tabs-menu');
        var curTabsContainer = curTabs.find('> .tabs-container');
        var newHTML = '';
        curTabsContainer.find('> .tabs-content').each(function() {
            var curTabTitle = $(this).attr('data-title');
            newHTML += '<div class="tabs-menu-item"><a href="#">' + curTabTitle + '</a></div> ';
        });
        curTabsContainer.find('> .tabs-content').eq(0).addClass('active');
        curTabsMenu.html(newHTML);
        curTabsMenu.find('.tabs-menu-item').eq(0).addClass('active');
    });

    $('body').on('click', '.tabs-menu-item a', function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            var curTabs = curLi.parents().filter('.tabs');
            curTabs.find('.tabs-menu-item.active').removeClass('active');
            curLi.addClass('active');
            var curIndex = curTabs.find('.tabs-menu-item').index(curLi);
            curTabs.find('.tabs-content.active').removeClass('active');
            curTabs.find('.tabs-content').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $('.main-regions-map').each(function() {
        var newMap = '';
        for (var i = 0; i < russiaRegions.length; i++) {
            newMap += '<g class="main-regions-map-region" data-id="' + russiaRegions[i].id + '" data-title="' + russiaRegions[i].title + '">' + russiaRegions[i].svg + '</g>';
        }
        $('.main-regions-map-inner svg').html(newMap);
    });

    $('body').on('mouseenter', '.main-regions-map-region', function(e) {
        $('.main-regions-map-region-hint').remove();
        $('body').append('<div class="main-regions-map-region-hint">' + $(this).attr('data-title') + '</div>');
        var curLeft = e.pageX;
        var curTop = e.pageY;
        $('.main-regions-map-region-hint').css({'left': curLeft, 'top': curTop});
    });

    $('body').on('mousemove', '.main-regions-map-region', function(e) {
        var curLeft = e.pageX;
        var curTop = e.pageY;
        $('.main-regions-map-region-hint').css({'left': curLeft, 'top': curTop});
    });

    $('body').on('mouseleave', '.main-regions-map-region', function(e) {
        $('.main-regions-map-region-hint').remove();
    });

    $('body').on('click', '.main-regions-map-region', function(e) {
        var curMapRegion = $(this);
        if (curMapRegion.hasClass('active')) {
            curMapRegion.removeClass('active');
            $('.main-regions-map-window').removeClass('visible');
        } else {
            $('.main-regions-map-region.active').removeClass('active');
            curMapRegion.addClass('active');
            $('.main-regions-map-window').removeClass('visible');
            var regionID = curMapRegion.attr('data-id');
            var regionData = null;
            for (var i = 0; i < russiaRegions.length; i++) {
                if (russiaRegions[i].id == regionID) {
                    regionData = russiaRegions[i];
                }
            }
            if (regionData !== null) {
                $('#main-regions-map-window-item-funds').html(regionData.funds);
                $('#main-regions-map-window-item-projects').html(regionData.projects);
                $('#main-regions-map-window-item-tenders').html(regionData.tenders);
                $('#main-regions-map-window-item-finance').html(regionData.finance);
                if (regionData.link !== null) {
                    $('.main-regions-map-window-link').addClass('visible');
                    $('.main-regions-map-window-link a').attr('href', regionData.link);
                } else {
                    $('.main-regions-map-window-link').removeClass('visible');
                }
            }
            $('.main-regions-map-window').addClass('visible');
        }
    });

    $('.up-link').click(function(e) {
        $('html, body').animate({'scrollTop': 0});
        e.preventDefault();
    });

    $('.opendata-block-title').click(function() {
        $(this).parent().toggleClass('open');
    });

    $('.opendata-group-title').click(function() {
        $(this).parent().toggleClass('open');
    });

    $('.opendata-filter-item select').change(function() {
        var curSelect = $(this);

        var curResults = curSelect.parents().filter('.opendata-group-container');
        curResults.find('.opendata-results').addClass('loading');
        var curForm = curResults.find('.opendata-filter form');
        var formData = curForm.serialize();

        $.ajax({
            type: 'GET',
            url: curForm.attr('action'),
            dataType: 'html',
            data: formData,
            cache: false
        }).done(function(html) {
            curResults.find('.opendata-results').html(html);
            curResults.find('.opendata-results').removeClass('loading');
        });
    });

    $('body').on('click', '.navigator-filter-block-menu-item a', function(e) {
        var curLi = $(this).parent();
        curMenu = curLi.parent().parent();
        curMenu.removeClass('open');
        if (!curLi.hasClass('active')) {
            $('.navigator-filter-block-menu-item.active').removeClass('active');
            curLi.addClass('active');
            var curIndex = $('.navigator-filter-block-menu-item').index(curLi);
            $('.navigator-filter-block-content.active').removeClass('active');
            $('.navigator-filter-block-content .form-checkbox input').prop('checked', false);
            $('.navigator-filter-block-content').eq(curIndex).addClass('active');
            if ($(window).width() > 1119) {
                $('html, body').animate({'scrollTop': curLi.offset().top});
            }
            curMenu.find('.navigator-filter-block-menu-current').html(curLi.find('a').html());
        } else {
            curLi.removeClass('active')
            $('.navigator-filter-block-content.active').removeClass('active');
            $('.navigator-filter-block-content .form-checkbox input').prop('checked', false);
            curMenu.find('.navigator-filter-block-menu-current').html(curMenu.find('.navigator-filter-block-menu-current').attr('data-placeholder'));
        }
        e.preventDefault();
    });

    $('.navigator-filter-block-menu-item.active').each(function() {
        var curLi = $(this);
            var curIndex = $('.navigator-filter-block-menu-item').index(curLi);
            $('.navigator-filter-block-content').eq(curIndex).addClass('active');
    });

    $('.navigator-filter-block-menu').each(function() {
        var curMenu = $(this);
        if (curMenu.find('.navigator-filter-block-menu-item.active').length == 1) {
            curMenu.find('.navigator-filter-block-menu-current').html(curMenu.find('.navigator-filter-block-menu-item.active a').html());
        } else {
            curMenu.find('.navigator-filter-block-menu-current').html(curMenu.find('.navigator-filter-block-menu-current').attr('data-placeholder'));
        }
        curMenu.find('.navigator-filter-block-menu-inner').attr('data-placeholder', curMenu.find('.navigator-filter-block-menu-current').attr('data-placeholder'));
    });

    $('.navigator-filter-block-menu-current').click(function() {
        var curMenu = $(this).parent();
        if (curMenu.hasClass('open')) {
            curMenu.removeClass('open');
        } else {
            $('.navigator-filter-block-menu.open').removeClass('open');
            curMenu.addClass('open');
        }
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.navigator-filter-block-menu').length == 0) {
            $('.navigator-filter-block-menu.open').removeClass('open');
        }
    });

    $('#navigator-district').change(function() {
        var curValue = $('#navigator-district').val();
        var newHTML = '<option value=""></option>';
        newHTML += '<option value="' + $('#navigator-region').attr('data-allvalue') + '">' + $('#navigator-region').attr('data-alltitle') + '</option>';
        if (curValue == '' || curValue == $('#navigator-district').attr('data-allvalue')) {
            for (var i = 0; i < navigatorRegions.length; i++) {
                newHTML += '<option value="' + navigatorRegions[i].id + '">' + navigatorRegions[i].title + '</option>';
            }
        } else {
            for (var i = 0; i < navigatorRegions.length; i++) {
                if (curValue == navigatorRegions[i].district) {
                    newHTML += '<option value="' + navigatorRegions[i].id + '">' + navigatorRegions[i].title + '</option>';
                }
            }
        }
        $('#navigator-region').html(newHTML);
        if ($('#navigator-region').attr('data-selected') != '') {
            $('#navigator-region option[value="' + $('#navigator-region').attr('data-selected') + '"]').prop('selected', true);
            $('#navigator-region').parent().find('.select2-container').addClass('select2-container--full');
        }
    });

    $('#navigator-district').each(function() {
        var newHTML = '<option value=""></option>';
        newHTML += '<option value="' + $('#navigator-district').attr('data-allvalue') + '">' + $('#navigator-district').attr('data-alltitle') + '</option>';
        for (var i = 0; i < navigatorDistricts.length; i++) {
            newHTML += '<option value="' + navigatorDistricts[i].id + '">' + navigatorDistricts[i].title + '</option>';
        }
        $('#navigator-district').html(newHTML);
        if ($('#navigator-district').attr('data-selected') != '') {
            $('#navigator-district option[value="' + $('#navigator-district').attr('data-selected') + '"]').prop('selected', true);
            $('#navigator-district').parent().find('.select2-container').addClass('select2-container--full');
        }
        $('#navigator-district').trigger('change');
    });

    $('.mobile-menu-link').click(function(e) {
        var curWidth = $(window).width();
        if (curWidth < 480) {
            curWidth = 480;
        }
        var curScroll = $(window).scrollTop();
        $('html').addClass('mobile-menu-open');
        $('meta[name="viewport"]').attr('content', 'width=' + curWidth);
        $('html').data('scrollTop', curScroll);
        $('.wrapper').css('margin-top', -curScroll);
        e.preventDefault();
    });

    $('.mobile-menu-close').click(function(e) {
        $('html').removeClass('mobile-menu-open');
        $('meta[name="viewport"]').attr('content', 'width=device-width');
        $('.wrapper').css('margin-top', 0);
        $(window).scrollTop($('html').data('scrollTop'));
        e.preventDefault();
    });

    $('.mobile-menu-bg').click(function() {
        $('html').removeClass('mobile-menu-open');
        $('meta[name="viewport"]').attr('content', 'width=device-width');
        $('.wrapper').css('margin-top', 0);
        $(window).scrollTop($('html').data('scrollTop'));
    });

});

function initForm(curForm) {
    curForm.find('.form-input input, .form-input textarea').each(function() {
        if ($(this).val() != '') {
            $(this).parent().addClass('full');
        }
    });

    curForm.find('input.phoneRU').mask('+7 000 000-00-00');

    curForm.find('.form-input textarea').each(function() {
        $(this).css({'height': this.scrollHeight, 'overflow-y': 'hidden'});
    });

    curForm.find('.form-select select').each(function() {
        var curSelect = $(this);
        var options = {
            minimumResultsForSearch: 20
        }

        if ($(window).width > 1119) {
            options['dropdownAutoWidth'] = true;
        }

        if (curSelect.prop('multiple')) {
            options['closeOnSelect'] = false;
        }

        curSelect.select2(options);

        curSelect.parent().find('.select2-container').attr('data-placeholder', curSelect.attr('data-placeholder'));
        curSelect.parent().find('.select2-selection').attr('data-placeholder', curSelect.attr('data-placeholder'));
        curSelect.on('select2:select', function(e) {
            $(e.delegateTarget).parent().find('.select2-container').addClass('select2-container--full');
            curSelect.parent().find('select.error').removeClass('error');
            curSelect.parent().find('label.error').remove();
        });

        curSelect.on('select2:unselect', function(e) {
            if (curSelect.find('option:selected').length == 0) {
                curSelect.parent().find('.select2-container').removeClass('select2-container--full');
            }
        });

        if (curSelect.find('option:selected').legnth > 0 || curSelect.find('option').legnth == 1 || curSelect.find('option:first').html() != '') {
            curSelect.trigger({type: 'select2:select'})
        }
    });

    curForm.validate({
        ignore: ''
    });
}

$(window).on('load resize', function() {

    $('.opendata-list').each(function() {
        var curList = $(this);

        curList.find('.opendata-item-inner').css({'min-height': '0px'});

        curList.find('.opendata-item-inner').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.outerHeight();
            var curTop = curBlock.offset().top;

            curList.find('.opendata-item-inner').each(function() {
                var otherBlock = $(this);
                if (otherBlock.offset().top == curTop) {
                    var newHeight = otherBlock.outerHeight();
                    if (newHeight > curHeight) {
                        curBlock.css({'min-height': newHeight + 'px'});
                    } else {
                        otherBlock.css({'min-height': curHeight + 'px'});
                    }
                }
            });
        });
    });

    $('.main-rsi-list').each(function() {
        var curList = $(this);

        curList.find('.main-rsi-item-inner').css({'min-height': '0px'});

        curList.find('.main-rsi-item-inner').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.outerHeight();
            var curTop = curBlock.offset().top;

            curList.find('.main-rsi-item-inner').each(function() {
                var otherBlock = $(this);
                if (otherBlock.offset().top == curTop) {
                    var newHeight = otherBlock.outerHeight();
                    if (newHeight > curHeight) {
                        curBlock.css({'min-height': newHeight + 'px'});
                    } else {
                        otherBlock.css({'min-height': curHeight + 'px'});
                    }
                }
            });
        });
    });

    resizeResults();

    $('.navigator-filter-block-menu').each(function() {
        var curMenu = $(this);
        if ($(window).width() > 1119) {
            curMenu.mCustomScrollbar({
                axis: 'x',
                scrollButtons: {
                    enable: true,
                    scrollAmount: 60
                },
                callbacks: {
                    onInit: function() {
                        curMenu.find('.mCSB_scrollTools.mCSB_scrollTools_horizontal .mCSB_buttonLeft').addClass('disabled');
                    },

                    whileScrolling: function() {
                        if (this.mcs.leftPct == 100) {
                            curMenu.find('.mCSB_scrollTools.mCSB_scrollTools_horizontal .mCSB_buttonRight').addClass('disabled');
                        } else {
                            curMenu.find('.mCSB_scrollTools.mCSB_scrollTools_horizontal .mCSB_buttonRight').removeClass('disabled');
                        }

                        if (this.mcs.leftPct == 0) {
                            curMenu.find('.mCSB_scrollTools.mCSB_scrollTools_horizontal .mCSB_buttonLeft').addClass('disabled');
                        } else {
                            curMenu.find('.mCSB_scrollTools.mCSB_scrollTools_horizontal .mCSB_buttonLeft').removeClass('disabled');

                        }
                    }
                }
            });
        } else {
            curMenu.mCustomScrollbar('destroy');
        }
    });

    $('.table-scroll').each(function() {
        if ($(window).width() < 1120) {
            $(this).mCustomScrollbar({
                axis: 'x',
                scrollButtons: {
                    enable: true
                }
            });
        } else {
            $(this).mCustomScrollbar('destroy');
        }
    });

    $('.main-regions-map-inner').each(function() {
        if ($(window).width() < 1120) {
            $(this).mCustomScrollbar({
                axis: 'x',
                scrollButtons: {
                    enable: true
                }
            });
        } else {
            $(this).mCustomScrollbar('destroy');
        }
    });

});

function resizeResults() {
    $('.navigator-results-list').each(function() {
        var curList = $(this);

        curList.find('.navigator-results-item-title').css({'min-height': '0px'});

        curList.find('.navigator-results-item-title').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.outerHeight();
            var curTop = curBlock.offset().top;

            curList.find('.navigator-results-item-title').each(function() {
                var otherBlock = $(this);
                if (otherBlock.offset().top == curTop) {
                    var newHeight = otherBlock.outerHeight();
                    if (newHeight > curHeight) {
                        curBlock.css({'min-height': newHeight + 'px'});
                    } else {
                        otherBlock.css({'min-height': curHeight + 'px'});
                    }
                }
            });
        });
    });
}

$(window).on('load resize scroll', function() {
    $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
    var windowScroll = $(window).scrollTop();
    var windowHeight = $('#body-test-height').height();

    if (windowScroll > windowHeight) {
        $('.up-link').addClass('visible');
    } else {
        $('.up-link').removeClass('visible');
    }

    if (windowScroll + windowHeight > $('footer').offset().top) {
        $('.up-link').css({'margin-bottom': (windowScroll + windowHeight) - $('footer').offset().top});
    } else {
        $('.up-link').css({'margin-bottom': 0});
    }
    $('#body-test-height').remove();
});