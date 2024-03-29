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
        $(window).trigger('load');
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

    $('body').on('click', '.main-regions-map .opendata-chart-map-inner g', function(e) {
        var curMapRegion = $(this);
        $('.main-regions-map-window').removeClass('visible');
        var regionID = curMapRegion.attr('data-id');
        var regionTitle = curMapRegion.attr('data-title');
        var regionData = null;
        for (var i = 0; i < mainRegionsData.length; i++) {
            if (mainRegionsData[i][0] == regionID) {
                regionData = mainRegionsData[i][2];
            }
        }
        if (regionData !== null) {
            $('#main-regions-map-window-item-title').html(regionTitle);
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
    });

    $('.up-link').click(function(e) {
        $('html, body').animate({'scrollTop': 0});
        e.preventDefault();
    });

    $('body').on('click', '.opendata-block-title', function() {
        $(this).parent().toggleClass('open');
    });

    $('body').on('click', '.opendata-group-title', function() {
        var curGroup = $(this).parent();
        curGroup.toggleClass('open');
        if (curGroup.hasClass('open')) {
            var curContainer = curGroup.find('.opendata-group-container');
            if (curContainer.attr('data-link')) {
                curContainer.addClass('loading');
                $.ajax({
                    type: 'GET',
                    url: curContainer.attr('data-link'),
                    dataType: 'html',
                    cache: false
                }).done(function(html) {
                    curContainer.html(html);
                    curContainer.removeClass('loading');
                    $(window).trigger('resize');
                });
                curContainer.removeAttr('data-link');
            }
        }
    });

    $('.opendata-filter-item select').change(function() {
        var curSelect = $(this);

        var curResults = curSelect.parents().filter('.opendata-group-container');
        var curForm = curResults.find('.opendata-filter form');

        var allSelected = true;
        curForm.find('.opendata-filter-item').each(function() {
            if ($(this).find('select').val() == '') {
                allSelected = false;
            }
        });
        if (allSelected) {
            var formData = curForm.serialize();
            curResults.find('.opendata-results').addClass('loading');
            $.ajax({
                type: 'GET',
                url: curForm.attr('action'),
                dataType: 'html',
                data: formData,
                cache: false
            }).done(function(html) {
                curResults.find('.opendata-results').html(html);
                curResults.find('.opendata-results').removeClass('loading');
                $(window).trigger('resize');
            });
        }
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

    $('body').on('click', '.navigator-filter-block-menu-all a', function(e) {
        var curLi = $(this).parent();
        curMenu = curLi.parent().parent();
        curMenu.removeClass('open');
        var curActive = curMenu.find('.navigator-filter-block-menu-item.active');
        curMenu.find('.navigator-filter-block-menu-item.active').removeClass('active');
        if (curActive.length == 1) {
            var curIndex = $('.navigator-filter-block-menu-item').index(curActive);
            $('.navigator-filter-block-content').eq(curIndex).removeClass('active');
            $('.navigator-filter-block-content').eq(curIndex).find('.form-checkbox input').prop('checked', false);
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

    $('.navigator-filter-title').click(function() {
        $('.navigator-filter').toggleClass('open');
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

        if ($(window).width() > 1119) {
            options['dropdownAutoWidth'] = true;
        }

        if (curSelect.prop('multiple')) {
            options['closeOnSelect'] = false;
        }

        if (curForm.parents().filter('.navigator-filter').length == 1) {
            options['allowClear'] = true;
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

    $('.main-navigator-list').each(function() {
        var curList = $(this);
        if ($(window).width() < 1120) {
            if (!curList.hasClass('slick-slider')) {
                $('.main-navigator-list').slick({
                    infinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    prevArrow: '<button type="button" class="slick-prev"></button>',
                    nextArrow: '<button type="button" class="slick-next"></button>',
                    adaptiveHeight: true,
                    dots: true
                });
            }
        } else {
            if (curList.hasClass('slick-slider')) {
                curList.slick('unslick');
            }
        }
    });

    $('.main-navigator-list').each(function() {
        var curList = $(this);

        curList.find('.main-navigator-item-inner').css({'min-height': '0px'});

        curList.find('.main-navigator-item-inner').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.outerHeight();
            var curTop = curBlock.offset().top;

            curList.find('.main-navigator-item-inner').each(function() {
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
        if ($(this).parents().filter('.opendata-table').length == 0) {
            $(this).mCustomScrollbar({
                axis: 'x',
                scrollButtons: {
                    enable: true
                }
            });
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

    if (typeof $('footer').offset() !== 'undefined') {
        if (windowScroll + windowHeight > $('footer').offset().top) {
            $('.up-link').css({'margin-bottom': (windowScroll + windowHeight) - $('footer').offset().top});
        } else {
            $('.up-link').css({'margin-bottom': 0});
        }
    }
    $('#body-test-height').remove();

    var headerHeight = 240;
    if ($(window).width() < 1120) {
        headerHeight = 220;
    }
    if (windowScroll > headerHeight) {
        $('html').addClass('header-fixed');
    } else {
        $('html').removeClass('header-fixed');
    }
});

$(window).on('load', function() {
    if (window.location.hash != '') {
        var curContainer = $(window.location.hash);
        if (curContainer.length == 1 && $('.tabs-menu-item').length > 0) {
            var tabsTransition = $('.tabs-content').eq(0).css('transition');
            $('.tabs-content').css('transition', 'none');
            $('.tabs-menu-item').eq(0).removeClass('active');
            $('.tabs-menu-item').eq(1).addClass('active');
            $('.tabs-content').eq(0).removeClass('active');
            $('.tabs-content').eq(1).addClass('active');
            $('.tabs-content').css('transition', tabsTransition);

            var curGroup = curContainer.parent();
            var curBlock = curGroup.parent().parent();
            var blockTransition = curBlock.find('.opendata-block-container').eq(0).css('transition');
            var groupTransition = curBlock.find('.opendata-group-container').eq(0).css('transition');
            curBlock.find('.opendata-block-container').css('transition', 'none');
            curGroup.find('.opendata-group-container').css('transition', 'none');
            curGroup.removeClass('open');
            curGroup.find('.opendata-group-title').trigger('click');
            curBlock.removeClass('open');
            curBlock.find('.opendata-block-title').trigger('click');
            $('html, body').animate({'scrollTop': curGroup.offset().top});
            curBlock.find('.opendata-block-container').css('transition', blockTransition);
            curGroup.find('.opendata-group-container').css('transition', groupTransition);
        }
    }
});

$(document).ready(function() {

    $('body').on('mouseenter', '.opendata-chart-map-inner g', function(e) {
        if ($(window).width() > 1119) {
            $('.opendata-chart-map-region-hint').remove();
            $('body').append('<div class="opendata-chart-map-region-hint">' +
                                 '<div class="opendata-chart-map-region-hint-container">' +
                                    '<div class="opendata-chart-map-region-hint-title">' + $(this).attr('data-title') + '</div>' +
                                    '<div class="opendata-chart-map-region-hint-value-map">' + $(this).attr('data-name') + ': <span>' + numberWithSpaces($(this).attr('data-value')) + '</span></div>' +
                                 '</div>' +
                             '</div>');
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.opendata-chart-map-region-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('click', '.opendata-chart-map-inner g', function(e) {
        if ($(window).width() < 1120) {
            $('.opendata-chart-map-region-hint').remove();
            $('body').append('<div class="opendata-chart-map-region-hint">' +
                                 '<div class="opendata-chart-map-region-hint-bg"></div>' +
                                 '<div class="opendata-chart-map-region-hint-container">' +
                                    '<div class="opendata-chart-map-region-hint-title">' + $(this).attr('data-title') + '</div>' +
                                    '<div class="opendata-chart-map-region-hint-value">' + $(this).attr('data-name') + ': <span>' + numberWithSpaces($(this).attr('data-value')) + '</span></div>' +
                                    '<a href="#" class="opendata-chart-map-region-hint-close"></a>' +
                                 '</div>' +
                             '</div>');
        }
    });

    $('body').on('click', '.opendata-chart-map-region-hint-close', function(e) {
        $('.opendata-chart-map-region-hint').remove();
        e.preventDefault();
    });

    $('body').on('click', '.opendata-chart-map-region-hint-bg', function() {
        $('.opendata-chart-map-region-hint').remove();
    });

    $('body').on('click', '.opendata-chart-org-main-hint-close', function(e) {
        $('.opendata-chart-org-main-hint').remove();
        e.preventDefault();
    });

    $('body').on('click', '.opendata-chart-org-main-hint-bg', function() {
        $('.opendata-chart-org-main-hint').remove();
    });

    $('body').on('click', '.opendata-chart-finance-hint-close', function(e) {
        $('.opendata-chart-finance-hint').remove();
        e.preventDefault();
    });

    $('body').on('click', '.opendata-chart-finance-hint-bg', function() {
        $('.opendata-chart-finance-hint').remove();
    });

    $('body').on('click', '.opendata-chart-org-hint-close', function(e) {
        $('.opendata-chart-org-hint').remove();
        e.preventDefault();
    });

    $('body').on('click', '.opendata-chart-org-hint-bg', function() {
        $('.opendata-chart-org-hint').remove();
    });

    $('body').on('mousemove', '.opendata-chart-map-inner g', function(e) {
        if ($(window).width() > 1119) {
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.opendata-chart-map-region-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('mouseleave', '.opendata-chart-map-inner g', function(e) {
        if ($(window).width() > 1119) {
            $('.opendata-chart-map-region-hint').remove();
        }
    });

    $('body').on('mouseenter', '.opendata-chart-graph-item-bar', function(e) {
        if ($(window).width() > 1119) {
            var curItemBar = $(this);
            $('.opendata-chart-map-region-hint').remove();
            var windowHTML = '<div class="opendata-chart-map-region-hint">' +
                                 '<div class="opendata-chart-map-region-hint-container">' +
                                    '<div class="opendata-chart-map-region-hint-title">' + $(this).find('.opendata-chart-graph-item-bar-item').eq(0).attr('data-name') + '</div>' +
                                    '<div class="opendata-chart-map-region-hint-values">';
            var curSumm = 0;
            curItemBar.find('.opendata-chart-graph-item-bar-item').each(function() {
                curSumm += Number($(this).attr('data-value'));
            });
            var summPercent = 0;
            curItemBar.find('.opendata-chart-graph-item-bar-item').each(function() {
                var newPercent = Math.round(Number($(this).attr('data-value')) / curSumm * 100);
                if (curItemBar.find('.opendata-chart-graph-item-bar-item').index($(this)) == curItemBar.find('.opendata-chart-graph-item-bar-item').length - 1) {
                    newPercent = 100 - summPercent;
                } else {
                    summPercent += newPercent;
                }
                windowHTML +=           '<div class="opendata-chart-map-region-hint-value">' +
                                            '<div class="opendata-chart-map-region-hint-value-legend">' +
                                                '<div class="opendata-chart-map-region-hint-value-legend-inner" style="background:' + $(this).css('background-color') + '"></div>' +
                                            '</div>'+
                                            '<div class="opendata-chart-map-region-hint-value-title">' + $(this).attr('data-title') + ':</div>' +
                                            '<div class="opendata-chart-map-region-hint-value-text">' + numberWithSpaces($(this).attr('data-value')) + '</div>' +
                                            '<div class="opendata-chart-map-region-hint-value-percent">' + newPercent + '%</div>' +
                                        '</div>';
            });

            windowHTML +=           '</div>' +
                                    '<div class="opendata-chart-map-region-hint-pie">' +
                                        '<canvas></canvas>' +
                                    '</div>' +
                                '</div>' +
                             '</div>';
            $('body').append(windowHTML);
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.opendata-chart-map-region-hint').css({'left': curLeft, 'top': curTop});

            var pieWidth = 126;
            var pieHeight = 126;

            var canvas = $('.opendata-chart-map-region-hint-pie canvas')[0];
            var context = canvas.getContext('2d');

			canvas.width = pieWidth;
            canvas.height = pieHeight;

            var summPercent = 0;
            var currentAngle = -0.5 * Math.PI;
            curItemBar.find('.opendata-chart-graph-item-bar-item').each(function() {
                var newPercent = Math.round(Number($(this).attr('data-value')) / curSumm * 100);
                if (curItemBar.find('.opendata-chart-graph-item-bar-item').index($(this)) == curItemBar.find('.opendata-chart-graph-item-bar-item').length - 1) {
                    newPercent = 100 - summPercent;
                }
                var sliceAngle = newPercent / 100 * 2 * Math.PI;
                context.beginPath();
                context.fillStyle = $(this).css('background-color');
                context.strokeStyle = $(this).css('background-color');
                context.moveTo(pieWidth / 2, pieHeight / 2);
                context.arc(pieWidth / 2, pieHeight / 2, pieWidth / 2, currentAngle, currentAngle + sliceAngle);
                context.lineTo(pieWidth / 2, pieHeight / 2);
                context.fill();
                if (newPercent > 9) {
                    $('.opendata-chart-map-region-hint-pie').append('<div class="opendata-chart-map-region-hint-pie-legend" style="transform:rotate(' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)"><span style="transform:translate(-50%, 0) rotate(-' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)">' + newPercent + '%</span></div>');
                } else {
                    $('.opendata-chart-map-region-hint-pie').append('<div class="opendata-chart-map-region-hint-pie-legend opendata-chart-map-region-hint-pie-legend-out" style="transform:rotate(' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)"><span style="transform:translate(-50%, 0) rotate(-' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)">' + newPercent + '%</span></div>');
                }
                currentAngle += sliceAngle;
                if (curItemBar.find('.opendata-chart-graph-item-bar-item').index($(this)) != curItemBar.find('.opendata-chart-graph-item-bar-item').length - 1) {
                    summPercent += newPercent;
                }
            });
        }
    });

    $('body').on('mouseenter', '.opendata-chart-graph-item-year', function(e) {
        if ($(window).width() > 1119) {
            $('.opendata-chart-map-region-hint').remove();
            var windowHTML = '<div class="opendata-chart-map-region-hint">' +
                                 '<div class="opendata-chart-map-region-hint-container">' +
                                    '<div class="opendata-chart-map-region-hint-title">' + $(this).parent().find('.opendata-chart-graph-item-bar').find('.opendata-chart-graph-item-bar-item').eq(0).attr('data-name') + '</div>' +
                                    '<div class="opendata-chart-map-region-hint-values">';
            $(this).parent().find('.opendata-chart-graph-item-bar').find('.opendata-chart-graph-item-bar-item').each(function() {
                windowHTML +=           '<div class="opendata-chart-map-region-hint-value">' +
                                            '<div class="opendata-chart-map-region-hint-value-legend">' +
                                                '<div class="opendata-chart-map-region-hint-value-legend-inner" style="background:' + $(this).css('background-color') + '"></div>' +
                                            '</div>'+
                                            '<div class="opendata-chart-map-region-hint-value-title">' + $(this).attr('data-title') + ':</div>' +
                                            '<div class="opendata-chart-map-region-hint-value-text">' + numberWithSpaces($(this).attr('data-value')) + '</div>' +
                                        '</div>';
            });

            windowHTML +=           '</div>' +
                                '</div>' +
                             '</div>';
            $('body').append(windowHTML);
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.opendata-chart-map-region-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('click', '.opendata-chart-graph-item-bar', function(e) {
        if ($(window).width() < 1120) {
            $('.opendata-chart-map-region-hint').remove();
            var windowHTML = '<div class="opendata-chart-map-region-hint">' +
                                 '<div class="opendata-chart-map-region-hint-bg"></div>' +
                                 '<div class="opendata-chart-map-region-hint-container">' +
                                    '<div class="opendata-chart-map-region-hint-title">' + $(this).find('.opendata-chart-graph-item-bar-item').eq(0).attr('data-name') + '</div>' +
                                    '<div class="opendata-chart-map-region-hint-values">';
            $(this).find('.opendata-chart-graph-item-bar-item').each(function() {
                windowHTML +=           '<div class="opendata-chart-map-region-hint-value">' +
                                            '<div class="opendata-chart-map-region-hint-value-legend">' +
                                                '<div class="opendata-chart-map-region-hint-value-legend-inner" style="background:' + $(this).css('background-color') + '"></div>' +
                                            '</div>'+
                                            '<div class="opendata-chart-map-region-hint-value-title">' + $(this).attr('data-title') + ':</div>' +
                                            '<div class="opendata-chart-map-region-hint-value-text">' + numberWithSpaces($(this).attr('data-value')) + '</div>' +
                                        '</div>';
            });

            windowHTML +=           '</div>' +
                                    '<a href="#" class="opendata-chart-map-region-hint-close"></a>' +
                                 '</div>' +
                             '</div>';
            $('body').append(windowHTML);
        }
    });

    $('body').on('click', '.opendata-chart-graph-item-year', function(e) {
        if ($(window).width() < 1120) {
            $('.opendata-chart-map-region-hint').remove();
            var windowHTML = '<div class="opendata-chart-map-region-hint">' +
                                 '<div class="opendata-chart-map-region-hint-bg"></div>' +
                                 '<div class="opendata-chart-map-region-hint-container">' +
                                    '<div class="opendata-chart-map-region-hint-title">' + $(this).parent().find('.opendata-chart-graph-item-bar').find('.opendata-chart-graph-item-bar-item').eq(0).attr('data-name') + '</div>' +
                                    '<div class="opendata-chart-map-region-hint-values">';
            $(this).parent().find('.opendata-chart-graph-item-bar').find('.opendata-chart-graph-item-bar-item').each(function() {
                windowHTML +=           '<div class="opendata-chart-map-region-hint-value">' +
                                            '<div class="opendata-chart-map-region-hint-value-legend">' +
                                                '<div class="opendata-chart-map-region-hint-value-legend-inner" style="background:' + $(this).css('background-color') + '"></div>' +
                                            '</div>'+
                                            '<div class="opendata-chart-map-region-hint-value-title">' + $(this).attr('data-title') + ':</div>' +
                                            '<div class="opendata-chart-map-region-hint-value-text">' + numberWithSpaces($(this).attr('data-value')) + '</div>' +
                                        '</div>';
            });

            windowHTML +=           '</div>' +
                                    '<a href="#" class="opendata-chart-map-region-hint-close"></a>' +
                                 '</div>' +
                             '</div>';
            $('body').append(windowHTML);
        }
    });

    $('body').on('mousemove', '.opendata-chart-graph-item-bar', function(e) {
        if ($(window).width() > 1119) {
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.opendata-chart-map-region-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('mousemove', '.opendata-chart-graph-item-year', function(e) {
        if ($(window).width() > 1119) {
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.opendata-chart-map-region-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('mouseleave', '.opendata-chart-graph-item-bar', function(e) {
        if ($(window).width() > 1119) {
            $('.opendata-chart-map-region-hint').remove();
        }
    });

    $('body').on('mouseleave', '.opendata-chart-graph-item-year', function(e) {
        if ($(window).width() > 1119) {
            $('.opendata-chart-map-region-hint').remove();
        }
    });

    $('body').on('click', '.opendata-chart-map-zoom-inc', function(e) {
        var curMap = $(this).parent();
        if (curMap.hasClass('opendata-chart-map-zoom-1')) {
            curMap.removeClass('opendata-chart-map-zoom-1');
            curMap.addClass('opendata-chart-map-zoom-2');
        } else if (curMap.hasClass('opendata-chart-map-zoom-2')) {
            curMap.removeClass('opendata-chart-map-zoom-2');
            curMap.addClass('opendata-chart-map-zoom-3');
        } else {
            curMap.addClass('opendata-chart-map-zoom-1');
        }
        e.preventDefault();
    });

    $('body').on('click', '.opendata-chart-map-zoom-dec', function(e) {
        var curMap = $(this).parent();
        if (curMap.hasClass('opendata-chart-map-zoom-3')) {
            curMap.removeClass('opendata-chart-map-zoom-3');
            curMap.addClass('opendata-chart-map-zoom-2');
        } else if (curMap.hasClass('opendata-chart-map-zoom-2')) {
            curMap.removeClass('opendata-chart-map-zoom-2');
            curMap.addClass('opendata-chart-map-zoom-1');
        } else {
            curMap.removeClass('opendata-chart-map-zoom-1');
        }
        e.preventDefault();
    });

    $('body').on('click', '.table-scroll-fixed .sort', function(e) {
        $(this).parents().filter('.opendata-table').find('.table-scroll .sort').eq(0).trigger('click');
        e.preventDefault();
    });

    $('body').on('click', '.opendata-table .table-scroll .sort', function(e) {
        var curLink = $(this);
        var curCol = curLink.parent();
        var curTable = curCol.parents().filter('table');
        var curColIndex = curTable.find('thead th').index(curCol);
        if (curLink.hasClass('active')) {
            curLink.toggleClass('up');
        } else {
            curTable.find('thead th a').removeClass('active up');
            curLink.addClass('active up');
        }
        var curRows = [];
        curTable.find('tbody tr').each(function() {
            curRows.push($(this));
        });
        if (curLink.hasClass('sort-number')) {
            curRows.sort(function(a, b) {
                var aValue = Number(a.find('td').eq(curColIndex).html().replace(/\<em\>.+\<\/em\>/g, '').replace(/\ |&nbsp;|—/g, ''));
                if (aValue == NaN) {
                    aValue = 0;
                }
                var bValue = Number(b.find('td').eq(curColIndex).html().replace(/\<em\>.+\<\/em\>/g, '').replace(/\ |&nbsp;|—/g, ''));
                if (bValue == NaN) {
                    bValue = 0;
                }
                if (aValue < bValue) return -1;
                if (aValue > bValue) return 1;
                return 0;
            });
        } else {
            curRows.sort(function(a, b) {
                var aValue = a.find('td').eq(curColIndex).html();
                var bValue = b.find('td').eq(curColIndex).html();
                if (aValue < bValue) return -1;
                if (aValue > bValue) return 1;
                return 0;
            });
        }

        if (curLink.hasClass('up')) {
            curRows.reverse();
        }

        var newHTML = '';
        for (var i = 0; i < curRows.length; i++) {
            newHTML += '<tr>' + curRows[i].html() + '</tr>';
        }
        curTable.find('tbody').html(newHTML);

        curBlock = curTable.parents().filter('.opendata-table');
        curBlock.find('.opendata-table-header-fixed-inner').html('');
        curBlock.find('thead th').each(function() {
            curBlock.find('.opendata-table-header-fixed-inner').append('<div class="opendata-table-header-fixed-item" style="width:' + $(this).outerWidth() + 'px">' + $(this).html() + '</div>');
        });

        curBlock.find('.table-scroll-fixed').remove();
        var htmlFixed = '<div class="table-scroll-fixed">' +
                            '<table>' +
                                '<thead>' +
                                    '<tr>' +
                                        '<th>' + curTable.find('th').eq(0).html() + '</th>' +
                                    '</tr>' +
                                '</thead>' +
                                '<tbody>';
        curTable.find('tbody tr').each(function() {
            htmlFixed +=            '<tr>' +
                                        '<td>' + $(this).find('td').eq(0).html() + '</td>' +
                                    '</tr>';
        });
        htmlFixed +=            '</tbody>' +
                            '</table>' +
                        '</div>';
        curBlock.append(htmlFixed)

        var fixedCol = curBlock.find('.table-scroll-fixed');
        fixedCol.find('th').width(curTable.find('th').eq(0).width()).height(curTable.find('th').eq(0).height());
        fixedCol.find('td').each(function() {
            var curTD = $(this);
            var curIndex = fixedCol.find('td').index(curTD);
            curTD.height(curTable.find('tbody tr').eq(curIndex).find('td').eq(0).height());
        });

        e.preventDefault();
    });

    $('body').on('click', '.opendata-table-header-fixed-item a', function(e) {
        var curTable = $(this).parents().filter('.opendata-table');
        var curIndex = curTable.find('.opendata-table-header-fixed-item a').index($(this));
        curTable.find('thead .sort').eq(curIndex).trigger('click');
    });

    $('body').on('mouseover', '.opendata-chart-legend-item-title', function(e) {
        var curTitle = $(this);
        if (curTitle.find('.opendata-chart-legend-item-title-short').height() >= curTitle.find('.opendata-chart-legend-item-title-full').height()) {
            curTitle.find('.opendata-chart-legend-item-title-full').css({'display': 'none'});
        }
    });

    $('body').on('mouseout', '.opendata-chart-legend-item-title', function(e) {
        var curTitle = $(this);
        curTitle.find('.opendata-chart-legend-item-title-full').css({'display': 'block'});
    });

});

function createChartBar(blockID, data) {
    var curBlock = $('[data-id="' + blockID + '"]');
    if (curBlock.length == 1) {
        makeChartBar(curBlock, data);
        curBlock.parent().find('.opendata-chart-menu-item a').unbind('click');
        curBlock.parent().find('.opendata-chart-menu-item a').click(function(e) {
            var curItem = $(this).parent();
            if (!curItem.hasClass('active')) {
                curItem.parent().find('.opendata-chart-menu-item.active').removeClass('active');
                curItem.addClass('active');
                makeChartBar(curBlock, data);
            }
            e.preventDefault();
        });
    }
}

function makeChartBar(curBlock, data) {
    var dataType = 'chart';
    if (curBlock.parent().find('.opendata-chart-menu').length == 1) {
        dataType = curBlock.parent().find('.opendata-chart-menu .opendata-chart-menu-item.active a').attr('data-type');
    }
    var newHTML = '';

    if (dataType == 'chart') {

        newHTML +=  '<div class="opendata-chart-content">' +
                        '<div class="opendata-chart-graph">' +
                            '<div class="opendata-chart-graph-container">' +
                                '<div class="opendata-chart-graph-scale"></div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="opendata-chart-legend">';
        for (var i = 0; i < data.legend.length; i++) {
            newHTML +=      '<div class="opendata-chart-legend-item">' +
                                '<div class="opendata-chart-legend-item-title"><div class="opendata-chart-legend-item-title-short">' + data.legend[i].title + '</div><div class="opendata-chart-legend-item-title-full">' + data.legend[i].title + '</div></div>' +
                                '<div class="opendata-chart-legend-item-color" style="background-color:' + data.legend[i].color + '"></div>' +
                            '</div>';
        }
        newHTML +=      '</div>' +
                    '</div>';
        curBlock.html(newHTML);
        var curMax = 0;
        for (var i = 0; i < data.data.length; i++) {
            var curSumm = 0;
            for (var j = 0; j < data.data[i].values.length; j++) {
                curSumm += Number(data.data[i].values[j]);
            }
            if (curMax < curSumm) {
                curMax = curSumm;
            }
        }

        var curScale = curBlock.find('.opendata-chart-graph-scale');
        var scaleTicks = Math.ceil(curMax / (Number(data.scaleStep) / Number(data.scaleStepTicks)));
        var scaleMax = scaleTicks * (Number(data.scaleStep) / Number(data.scaleStepTicks));

        curScale.append('<div class="opendata-chart-graph-scale-sizer">' + scaleMax + '</div>');

        curScale.append('<div class="opendata-chart-graph-scale-tick bottom" style="bottom:0%"></div>');
        curScale.append('<div class="opendata-chart-graph-scale-title bottom" style="bottom:0%">0</div>');
        for (var i = 1; i <= scaleTicks; i++) {
            var tickClass = '';
            if (i * (Number(data.scaleStep) / Number(data.scaleStepTicks)) % Number(data.scaleStep) == 0) {
                tickClass = 'step';
                curScale.append('<div class="opendata-chart-graph-scale-title" style="bottom:' + (i / scaleTicks * 100) + '%">' + (i * (Number(data.scaleStep) / Number(data.scaleStepTicks))) + '</div>');
            }
            curScale.append('<div class="opendata-chart-graph-scale-tick ' + tickClass + '" style="bottom:' + (i / scaleTicks * 100) + '%"></div>');
        }

        var curGraph = curBlock.find('.opendata-chart-graph-container');
        for (var i = 0; i < data.data.length; i++) {
            var itemHTML =  '<div class="opendata-chart-graph-item">' +
                                '<div class="opendata-chart-graph-item-year">' + data.data[i].year + '</div>';
            var curSumm = 0;
            for (var j = 0; j < data.data[i].values.length; j++) {
                curSumm += Number(data.data[i].values[j]);
            }
            var itemBarHTML = '';
            var tmpSumm = 0;
            for (var j = 0; j < data.data[i].values.length; j++) {
                itemBarHTML +=      '<div class="opendata-chart-graph-item-bar-item" style="background-color:' + data.legend[j].color + '; bottom:' + tmpSumm + '%; height:' + (Number(data.data[i].values[j]) / curSumm * 100) + '%" data-title="' + data.legend[j].title + '" data-value="' + data.data[i].values[j] + '" data-name="' + data.titleTable + '"></div>';
                tmpSumm += Number(data.data[i].values[j]) / curSumm * 100;
            }
            itemHTML +=         '<div class="opendata-chart-graph-item-bar" style="height:' + (curSumm / scaleMax * 100) + '%">' + itemBarHTML + '</div>';
            itemHTML +=     '</div>';
            curGraph.append(itemHTML);
        }

        curBlock.find('.opendata-chart-graph').each(function() {
            $(this).mCustomScrollbar({
                axis: 'x',
                scrollButtons: {
                    enable: true
                }
            });
        });

    } else {

        var tableData = {
            'headers'   : [],
            'rows'      : []
        };

        tableData.headers.push({
            'size'  : 'big',
            'sort'  : true,
            'type'  : 'text',
            'text'  : data.titleTable
        });
        if (typeof data.needSumm !== 'undefined' && data.needSumm) {
            tableData.headers.push({
                'size'  : 'little',
                'sort'  : true,
                'type'  : 'number',
                'text'  : data.summTitle
            });
        }
        for (var i = 0; i < data.data.length; i++) {
            tableData.headers.push({
                'size'  : 'little',
                'sort'  : true,
                'type'  : 'number',
                'text'  : data.data[i].year
            });
        }

        for (var i = 0; i < data.legend.length; i++) {
            var newRow = [];
            newRow.push(data.legend[i].title);
            if (typeof data.needSumm !== 'undefined' && data.needSumm) {
                var summAll = 0;
                for (var j = 0; j < data.data.length; j++) {
                    if (data.data[j].values[i] !== null) {
                        summAll += data.data[j].values[i];
                    }
                }
                newRow.push(numberWithSpaces(summAll.toFixed(3)));
            }
            for (var j = 0; j < data.data.length; j++) {
                if (data.data[j].values[i] == null) {
                    newRow.push('—');
                } else {
                    newRow.push(numberWithSpaces(data.data[j].values[i]));
                }
            }
            tableData.rows.push(newRow);
        }

        createTable(curBlock, tableData, 15, 1, 'up');
    }
}

function createChartLine(blockID, data) {
    var curBlock = $('[data-id="' + blockID + '"]');
    if (curBlock.length == 1) {
        makeChartLine(curBlock, data);
        curBlock.parent().find('.opendata-chart-menu-item a').unbind('click');
        curBlock.parent().find('.opendata-chart-menu-item a').click(function(e) {
            var curItem = $(this).parent();
            if (!curItem.hasClass('active')) {
                curItem.parent().find('.opendata-chart-menu-item.active').removeClass('active');
                curItem.addClass('active');
                makeChartLine(curBlock, data);
            }
            e.preventDefault();
        });
    }
}

function makeChartLine(curBlock, data) {
    var dataType = 'chart';
    if (curBlock.parent().find('.opendata-chart-menu').length == 1) {
        dataType = curBlock.parent().find('.opendata-chart-menu .opendata-chart-menu-item.active a').attr('data-type');
    }
    var newHTML = '';

    if (dataType == 'chart') {

        newHTML +=  '<div class="opendata-chart-content">' +
                        '<div class="opendata-chart-graph opendata-chart-graph-line">' +
                            '<div class="opendata-chart-graph-container">' +
                                '<div class="opendata-chart-graph-scale"></div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="opendata-chart-legend">';
        for (var i = 0; i < data.legend.length; i++) {
            newHTML +=      '<div class="opendata-chart-legend-item">' +
                                '<div class="opendata-chart-legend-item-title"><div class="opendata-chart-legend-item-title-short">' + data.legend[i].title + '</div><div class="opendata-chart-legend-item-title-full">' + data.legend[i].title + '</div></div>' +
                                '<div class="opendata-chart-legend-item-color" style="background-color:' + data.legend[i].color + '"></div>' +
                            '</div>';
        }
        newHTML +=      '</div>' +
                    '</div>';
        curBlock.html(newHTML);
        var curMax = 0;
        for (var i = 0; i < data.data.length; i++) {
            var curSumm = 0;
            for (var j = 0; j < data.data[i].values.length; j++) {
                if (curMax < Number(data.data[i].values[j])) {
                    curMax = Number(data.data[i].values[j]);
                }
            }
        }

        var curScale = curBlock.find('.opendata-chart-graph-scale');
        var scaleTicks = Math.ceil(curMax / (Number(data.scaleStep) / Number(data.scaleStepTicks)));
        var scaleMax = scaleTicks * (Number(data.scaleStep) / Number(data.scaleStepTicks));

        curScale.append('<div class="opendata-chart-graph-scale-sizer">' + scaleMax + '</div>');

        curScale.append('<div class="opendata-chart-graph-scale-tick bottom" style="bottom:0%"></div>');
        curScale.append('<div class="opendata-chart-graph-scale-title bottom" style="bottom:0%">0</div>');
        for (var i = 1; i <= scaleTicks; i++) {
            var tickClass = '';
            if (i * (Number(data.scaleStep) / Number(data.scaleStepTicks)) % Number(data.scaleStep) == 0) {
                tickClass = 'step';
                curScale.append('<div class="opendata-chart-graph-scale-title" style="bottom:' + (i / scaleTicks * 100) + '%">' + (i * (Number(data.scaleStep) / Number(data.scaleStepTicks))) + '</div>');
            }
            curScale.append('<div class="opendata-chart-graph-scale-tick ' + tickClass + '" style="bottom:' + (i / scaleTicks * 100) + '%"></div>');
        }

        var curGraph = curBlock.find('.opendata-chart-graph-container');

        function angle_point(a, b, c) {
            var x1 = a[0] - b[0];
            var x2 = c[0] - b[0];
            var y1 = a[1] - b[1];
            var y2 = c[1] - b[1];

            var d1 = Math.sqrt(x1 * x1 + y1 * y1);
            var d2 = Math.sqrt(x2 * x2 + y2 * y2);
            return Math.acos((x1 * x2 + y1 * y2) / (d1 * d2)) * 180 / Math.PI;
        }

        var itemWidth = 80;
        if ($(window).width() < 1120) {
            itemWidth = 90;
        }

        for (var i = 0; i < data.legend.length; i++) {
            var lineDots = [];
            for (var j = 0; j < data.data.length; j++) {
                if (data.data[j].values[i] !== null) {
                    lineDots.push({'year': j, 'value': Number(data.data[j].values[i])});
                }
            }

            for (var j = 0; j < lineDots.length; j++) {
                var curX = lineDots[j].year * itemWidth + curScale.outerWidth() + itemWidth / 2;
                var curY = curScale.height() - (curScale.height() * (lineDots[j].value / scaleMax)) + 10;
                if (j > 0) {
                    var prevX = lineDots[j - 1].year * itemWidth + curScale.outerWidth() + itemWidth / 2;
                    var prevY = curScale.height() - curScale.height() * (lineDots[j - 1].value / scaleMax) + 10;
                    var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                    var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                    if (curY < prevY) {
                        curAngle = -curAngle;
                    }
                    curGraph.append('<div class="opendata-chart-graph-item-point-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg); border-top-color:' + data.legend[i].color + '"></div>');
                }
            }
        }

        for (var i = 0; i < data.data.length; i++) {
            var itemHTML =  '<div class="opendata-chart-graph-item line">' +
                                '<div class="opendata-chart-graph-item-year">' + data.data[i].year + '</div>';
            for (var j = 0; j < data.data[i].values.length; j++) {
                if (data.data[i].values[j] !== null) {
                    itemHTML += '<div class="opendata-chart-graph-item-point" style="bottom:' + (Number(data.data[i].values[j]) / scaleMax * 100) + '%; border-color:' + data.legend[j].color + '" data-id="' + j + '"></div>';
                }
            }
            itemHTML +=     '</div>';
            curGraph.append(itemHTML);
        }

        curBlock.find('.opendata-chart-graph').each(function() {
            $(this).mCustomScrollbar({
                axis: 'x',
                scrollButtons: {
                    enable: true
                }
            });
        });

        curBlock.find('.opendata-chart-graph-item-point').on('mouseenter', function(e) {
            if ($(window).width() > 1119) {
                var curID = Number($(this).attr('data-id'));
                $('.opendata-chart-map-region-hint').remove();
                var hintHTML =  '<div class="opendata-chart-map-region-hint">' +
                                    '<div class="opendata-chart-map-region-hint-container">' +
                                        '<div class="opendata-chart-map-region-hint-title">' + data.legend[curID].title + '</div>' +
                                        '<div class="opendata-chart-map-region-hint-values-title">' + data.titleTable + ':</div>';
                                        '<div class="opendata-chart-map-region-hint-values">';
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].values[curID] !== null) {
                        hintHTML +=         '<div class="opendata-chart-map-region-hint-value">' +
                                                '<div class="opendata-chart-map-region-hint-value-title">' + data.data[i].year + '</div>' +
                                                '<div class="opendata-chart-map-region-hint-value-text">' + numberWithSpaces(data.data[i].values[curID]) + '</div>' +
                                            '</div>';
                    }
                }
                hintHTML +=             '</div>' +
                                    '</div>' +
                                '</div>';
                $('body').append(hintHTML);
                var curLeft = e.pageX;
                var curTop = e.pageY;
                $('.opendata-chart-map-region-hint').css({'left': curLeft, 'top': curTop});
            }
        });

        curBlock.find('.opendata-chart-graph-item-point').on('click', function(e) {
            if ($(window).width() < 1120) {
                var curID = Number($(this).attr('data-id'));
                $('.opendata-chart-map-region-hint').remove();
                var hintHTML =  '<div class="opendata-chart-map-region-hint">' +
                                    '<div class="opendata-chart-map-region-hint-bg"></div>' +
                                    '<div class="opendata-chart-map-region-hint-container">' +
                                        '<div class="opendata-chart-map-region-hint-title">' + data.legend[curID].title + '</div>' +
                                        '<div class="opendata-chart-map-region-hint-values-title">' + data.titleTable + ':</div>' +
                                        '<div class="opendata-chart-map-region-hint-values">';
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].values[curID] !== null) {
                        hintHTML +=         '<div class="opendata-chart-map-region-hint-value">' +
                                                '<div class="opendata-chart-map-region-hint-value-title">' + data.data[i].year + '</div>' +
                                                '<div class="opendata-chart-map-region-hint-value-text">' + numberWithSpaces(data.data[i].values[curID]) + '</div>' +
                                            '</div>';
                    }
                }
                hintHTML +=             '</div>' +
                                        '<a href="#" class="opendata-chart-map-region-hint-close"></a>' +
                                    '</div>' +
                                '</div>';
                $('body').append(hintHTML);
            }
        });

        curBlock.find('.opendata-chart-graph-item-point').on('mousemove', function(e) {
            if ($(window).width() > 1119) {
                var curLeft = e.pageX;
                var curTop = e.pageY;
                $('.opendata-chart-map-region-hint').css({'left': curLeft, 'top': curTop});
            }
        });

        curBlock.find('.opendata-chart-graph-item-point').on('mouseleave', function(e) {
            if ($(window).width() > 1119) {
                $('.opendata-chart-map-region-hint').remove();
            }
        });

    } else {

        var tableData = {
            'headers'   : [],
            'rows'      : []
        };

        tableData.headers.push({
            'size'  : 'big',
            'sort'  : true,
            'type'  : 'text',
            'text'  : data.titleTable
        });
        if (typeof data.needSumm !== 'undefined' && data.needSumm) {
            tableData.headers.push({
                'size'  : 'little',
                'sort'  : true,
                'type'  : 'number',
                'text'  : data.summTitle
            });
        }
        for (var i = 0; i < data.data.length; i++) {
            tableData.headers.push({
                'size'  : 'little',
                'sort'  : true,
                'type'  : 'number',
                'text'  : data.data[i].year
            });
        }

        for (var i = 0; i < data.legend.length; i++) {
            var newRow = [];
            newRow.push(data.legend[i].title);
            if (typeof data.needSumm !== 'undefined' && data.needSumm) {
                var summAll = 0;
                for (var j = 0; j < data.data.length; j++) {
                    if (data.data[j].values[i] !== null) {
                        summAll += data.data[j].values[i];
                    }
                }
                newRow.push(numberWithSpaces(summAll.toFixed(3)));
            }
            for (var j = 0; j < data.data.length; j++) {
                if (data.data[j].values[i] == null) {
                    newRow.push('—');
                } else {
                    newRow.push(numberWithSpaces(data.data[j].values[i]));
                }
            }
            tableData.rows.push(newRow);
        }

        createTable(curBlock, tableData, 15, 1, 'up');

    }
}

function createChartMap(blockID, data) {
    var curBlock = $('[data-id="' + blockID + '"]');
    if (curBlock.length == 1) {
        makeChartMap(curBlock, data);
        curBlock.parent().find('.opendata-chart-menu-item a').unbind('click');
        curBlock.parent().find('.opendata-chart-menu-item a').click(function(e) {
            var curItem = $(this).parent();
            if (!curItem.hasClass('active')) {
                curItem.parent().find('.opendata-chart-menu-item.active').removeClass('active');
                curItem.addClass('active');
                makeChartMap(curBlock, data);
            }
            e.preventDefault();
        });
    }
}

function makeChartMap(curBlock, data) {
    var dataType = 'chart';
    if (curBlock.parent().find('.opendata-chart-menu').length == 1) {
        dataType = curBlock.parent().find('.opendata-chart-menu .opendata-chart-menu-item.active a').attr('data-type');
    }
    var newHTML = '';

    if (dataType == 'chart') {

        if (data.data.length > 1) {
            newHTML +=  '<div class="opendata-chart-map-year">' +
                            '<div class="opendata-chart-map-year-inner">';
            for (var i = 0; i < data.data.length; i++) {
                newHTML +=      '<div class="opendata-chart-map-year-item"><a href="#">' + data.data[i].year + '</a></div>';
            }
            newHTML +=      '</div>' +
                        '</div>';
        }

        newHTML +=  '<div class="opendata-chart-map-wrapper"><div class="opendata-chart-map-inner"><svg width="1040" height="591" viewBox="0 0 1107.77 630.12" fill="none" xmlns="http://www.w3.org/2000/svg"></svg></div><a href="#" class="opendata-chart-map-zoom-inc"></a><a href="#" class="opendata-chart-map-zoom-dec"></a></div>';

        if (curBlock.data('year') === undefined) {
            curBlock.data('year', data.data[0].year);
        }
        var curYear = curBlock.data('year');
        var curData = null;
        for (var i = 0; i < data.data.length; i++) {
            if ( data.data[i].year == curYear) {
                curData =  data.data[i].values;
            }
        }

        var curMax = 0;
        for (var i = 0; i < curData.length; i++) {
            if (curMax < Number(curData[i][1])) {
                curMax = Number(curData[i][1]);
            }
        }

        data.ranges = [];
        var map_rages = [0.000001, 0.01, 0.03, 0.20, 1.10];
        var mr_prev = 0;

        for (var i = 0; i < map_rages.length; i++) {
            var rangeStart = curMax * mr_prev;
            var rangeStop = curMax * map_rages[i];
            if (data.numberFixed == 0) {
                rangeStop = Math.ceil(rangeStop);
                rangeStart = Math.ceil(rangeStart);
            }
            data.ranges.push([rangeStart, rangeStop, data.colors[i]]);
            mr_prev = map_rages[i];
        }

        newHTML +=  '<div class="opendata-chart-map-legend">' +
                        '<div class="opendata-chart-map-legend-title">' + data.titleRanges + '</div>' +
                        '<div class="opendata-chart-map-legend-list">';
        for (var i = 1; i < data.ranges.length; i++) {
            newHTML +=      '<div class="opendata-chart-map-legend-item" style="background:' + data.ranges[i][2] + '"><span>' + (data.ranges[i][1]).toFixed(data.numberFixed) + '</span></div>';
        }
        newHTML += '<em>' + data.ranges[0][0] + '</em>';
        newHTML +=      '</div>' +
                    '</div>';

        curBlock.html(newHTML);

        curBlock.find('.opendata-chart-map-year-item a:contains("' + curBlock.data('year') + '")').parent().addClass('active');

        if (curData !== null) {
            var newMap = '';

            for (var j = 0; j < opendataRegions.length; j++) {
                var curRegion = opendataRegions[j];
                for (var i = 0; i < curData.length; i++) {
                    if (curRegion.id == curData[i][0]) {
                        var curColorIndex = -1;
                        var curValue = Number(curData[i][1]);
                        for (var c = 0; c < data.ranges.length; c++) {
                            if (curValue >= data.ranges[c][0] && curValue <= data.ranges[c][1]) {
                                curColorIndex = c;
                            }
                            if (curValue == 0) {
                                curColorIndex = 0;
                            }
                        }

                        var curColor = data.ranges[curColorIndex][2];

                        newMap += '<g style="fill:' + curColor + '" data-id="' + curRegion.id + '" data-title="' + curRegion.title + '" data-value="' + curValue + '" data-name="' + data.titleRanges + '">' + curRegion.svg + '</g>';
                    }
                }
            }
            curBlock.find('.opendata-chart-map-inner svg').html(newMap);
            curBlock.find('.opendata-chart-map-inner').each(function() {
                $(this).mCustomScrollbar({
                    axis: 'x',
                    scrollButtons: {
                        enable: true
                    }
                });
            });
        }

        curBlock.find('.opendata-chart-map-year-item a').click(function(e) {
            var curItem = $(this).parent();
            if (!curItem.hasClass('active')) {
                curItem.parent().find('.opendata-chart-map-year-item.active').removeClass('active');
                curItem.addClass('active');
                curItem.parents().find('.opendata-chart-container').data('year', curItem.find('a').html());
                makeChartMap(curBlock, data);
            }
            e.preventDefault();
        });

    } else {

        var tableData = {
            'headers'   : [],
            'rows'      : []
        };

        tableData.headers.push({
            'size'  : 'big',
            'sort'  : true,
            'type'  : 'text',
            'text'  : data.titleTable
        });
        if (typeof data.needSumm !== 'undefined' && data.needSumm) {
            tableData.headers.push({
                'size'  : 'little',
                'sort'  : true,
                'type'  : 'number',
                'text'  : data.summTitle
            });
        }
        for (var i = 0; i < data.data.length; i++) {
            tableData.headers.push({
                'size'  : 'little',
                'sort'  : true,
                'type'  : 'number',
                'text'  : data.data[i].year
            });
        }

        for (var i = 0; i < opendataRegions.length; i++) {
            var newRow = [];
            newRow.push(opendataRegions[i].title);
            if (typeof data.needSumm !== 'undefined' && data.needSumm) {
                var summAll = 0;
                var isHas = false;
                for (var j = 0; j < data.data.length; j++) {
                    for (var k = 0; k < data.data[j].values.length; k++) {
                        if (data.data[j].values[k][0] == opendataRegions[i].id) {
                            summAll += data.data[j].values[k][1];
                            isHas = true;
                        }
                    }
                }
                if (!isHas) {
                    newRow.push('—');
                } else {
                    newRow.push(numberWithSpaces(summAll.toFixed(3)));
                }
            }

            for (var j = 0; j < data.data.length; j++) {
                var isHas = false;
                for (var k = 0; k < data.data[j].values.length; k++) {
                    if (data.data[j].values[k][0] == opendataRegions[i].id) {
                        newRow.push(numberWithSpaces(data.data[j].values[k][1]));
                        isHas = true;
                    }
                }
                if (!isHas) {
                    newRow.push('—');
                }
            }
            tableData.rows.push(newRow);
        }

        createTable(curBlock, tableData, 15, 1, 'up');

    }
}

function createChartBubble(blockID, data) {
    for (var i = 0; i < data.legend.length; i++) {
        data.legend[i].id = i;
    }
    var curBlock = $('[data-id="' + blockID + '"]');
    if (curBlock.length == 1) {
        makeChartBubble(curBlock, data);
        curBlock.parent().find('.opendata-chart-menu-item a').unbind('click');
        curBlock.parent().find('.opendata-chart-menu-item a').click(function(e) {
            var curItem = $(this).parent();
            if (!curItem.hasClass('active')) {
                curItem.parent().find('.opendata-chart-menu-item.active').removeClass('active');
                curItem.addClass('active');
                makeChartBubble(curBlock, data);
            }
            e.preventDefault();
        });
    }
}

function makeChartBubble(curBlock, data) {
    var dataType = 'chart';
    if (curBlock.parent().find('.opendata-chart-menu').length == 1) {
        dataType = curBlock.parent().find('.opendata-chart-menu .opendata-chart-menu-item.active a').attr('data-type');
    }
    var newHTML = '';

    if (typeof data.legend[0].sort !== 'undefined') {
        data.legend.sort(function(a, b) {
            if (a.sort < b.sort) return -1;
            if (a.sort > b.sort) return 1;
            return 0;
        });
    }

    if (dataType == 'chart') {

        newHTML +=  '<div class="opendata-chart-bubble-content">' +
                        '<div class="opendata-chart-bubble-legend">';
        for (var i = 0; i < data.legend.length; i++) {
            newHTML +=      '<div class="opendata-chart-bubble-legend-item">' +
                                '<div class="opendata-chart-bubble-legend-item-inner">' +
                                    data.legend[i].title +
                                '</div>' +
                            '</div>';
        }
        newHTML +=      '</div>' +
                        '<div class="opendata-chart-bubble-graph">' +
                            '<div class="opendata-chart-bubble-graph-container">' +
                            '</div>' +
                        '</div>' +
                    '</div>';
        curBlock.html(newHTML);
        var curMax = 0;
        for (var i = 0; i < data.data.length; i++) {
            var curSumm = 0;
            for (var j = 0; j < data.data[i].values.length; j++) {
                if (curMax < Number(data.data[i].values[j])) {
                    curMax = Number(data.data[i].values[j]);
                }
            }
        }

        var curGraph = curBlock.find('.opendata-chart-bubble-graph-container');
        var graphHTML = '';
        for (var i = 0; i < data.legend.length; i++) {
            graphHTML +=        '<div class="opendata-chart-bubble-graph-item-mobile-title"><span style="background-color:' + data.legend[i].color + '"></span>' + data.legend[i].title + '</div>';
            if ($(window).width() < 1120) {
                graphHTML +=        '<div class="opendata-chart-bubble-graph-item-mobile"><div class="opendata-chart-bubble-graph-item-mobile-inner">';
            }
            graphHTML +=        '<div class="opendata-chart-bubble-graph-item"><div class="opendata-chart-bubble-graph-item-inner" style="height:' + (curBlock.find('.opendata-chart-bubble-legend-item').eq(i).outerHeight()) + 'px"></div></div>';
            graphHTML +=        '<div class="opendata-chart-bubble-graph-years-mobile">';
            for (var j = 0; j < data.data.length; j++) {
                graphHTML +=        '<div class="opendata-chart-bubble-graph-year"><span>' + data.data[j].year + '</span></div>';
            }
            graphHTML +=        '</div>';
            if ($(window).width() < 1120) {
                graphHTML +=        '</div></div>';
            }
        }

        graphHTML +=            '<div class="opendata-chart-bubble-graph-years">';
        for (var i = 0; i < data.data.length; i++) {
            graphHTML +=            '<div class="opendata-chart-bubble-graph-year"><span>' + data.data[i].year + '</span></div>';
        }
        graphHTML +=            '</div>';
        curGraph.html(graphHTML);
        graphHTML =             '<div class="opendata-chart-bubble-graph-years-fixed">' +
                                    '<div class="opendata-chart-bubble-graph-years-fixed-inner">';
        for (var i = 0; i < data.data.length; i++) {
            graphHTML +=                '<div class="opendata-chart-bubble-graph-year"><span>' + data.data[i].year + '</span></div>';
        }
        graphHTML +=                '</div>' +
                                '</div>';
        curBlock.find('.opendata-chart-bubble-content').append(graphHTML);

        var itemWidth = 80;
        for (var i = 0; i < data.legend.length; i++) {
            var curID = data.legend[i].id;
            var mobileStart = -1;
            var mobileStop = -1;
            for (var j = 0; j < data.data.length; j++) {
                var curBubble = '';
                if (data.data[j].values[curID] !== null) {
                    if (mobileStart == -1) {
                        mobileStart = j;
                    }
                    mobileStop = j
                    var curBubbleSize = Number(data.data[j].values[curID]) / curMax * 100;

                    var curBubblePrev = '';
                    if (j > 0 && data.data[j - 1].values[curID] !== null) {
                        curBubblePrev = '<div class="opendata-chart-bubble-graph-item-bubble-prev" style="background-color:' + data.legend[i].color + '"></div>';
                    }

                    curBubble = curBubblePrev +
                                '<div class="opendata-chart-bubble-graph-item-bubble-bg" style="background-color:' + data.legend[i].color + '; width:' + curBubbleSize + '%; height:' + curBubbleSize + '%"></div>' +
                                '<div class="opendata-chart-bubble-graph-item-bubble-value">' + numberWithSpaces(data.data[j].values[curID]) + '</div>';
                }
                curBlock.find('.opendata-chart-bubble-graph-item').eq(i).find('.opendata-chart-bubble-graph-item-inner').append('<div class="opendata-chart-bubble-graph-item-bubble">' + curBubble + '</div>');
            }
            if ($(window).width() < 1120) {
                curBlock.find('.opendata-chart-bubble-graph-item-mobile').each(function() {
                    var curYears = $(this);
                    $(this).mCustomScrollbar({
                        axis: 'x',
                        scrollButtons: {
                            enable: true
                        }
                    });
                });
            }
        }

        curBlock.find('.opendata-chart-bubble-graph').css({'max-width': 'calc(100% - ' + (curBlock.find('.opendata-chart-bubble-legend').width() + 50) + 'px)'});

        if ($(window).width() > 1119) {
            curBlock.find('.opendata-chart-bubble-graph').each(function() {
                var curScrollBlock = $(this);
                $(this).mCustomScrollbar({
                    axis: 'x',
                    scrollButtons: {
                        enable: true
                    },
                    callbacks: {
                        onInit: function() {
                            curScrollBlock.addClass('shadowRight');
                        },

                        whileScrolling: function() {
                            if (this.mcs.leftPct == 100) {
                                curScrollBlock.removeClass('shadowRight');
                            } else {
                                curScrollBlock.addClass('shadowRight');
                            }

                            if (this.mcs.leftPct == 0) {
                                curScrollBlock.removeClass('shadowLeft');
                            } else {
                                curScrollBlock.addClass('shadowLeft');

                            }
                            curBlock.find('.opendata-chart-bubble-graph-years-fixed').css({'width': curBlock.find('.opendata-chart-bubble-graph').width(), 'left': curBlock.find('.opendata-chart-bubble-graph').offset().left});
                            curBlock.find('.opendata-chart-bubble-graph-years-fixed-inner').css({'left': curBlock.find('.mCSB_container').css('left')});
                        }
                    }
                });
            });
        }

    } else {

        var tableData = {
            'headers'   : [],
            'rows'      : []
        };

        tableData.headers.push({
            'size'  : 'big',
            'sort'  : true,
            'type'  : 'text',
            'text'  : data.titleTable
        });
        if (typeof data.needSumm !== 'undefined' && data.needSumm) {
            tableData.headers.push({
                'size'  : 'little',
                'sort'  : true,
                'type'  : 'number',
                'text'  : data.summTitle
            });
        }
        for (var i = 0; i < data.data.length; i++) {
            tableData.headers.push({
                'size'  : 'little',
                'sort'  : true,
                'type'  : 'number',
                'text'  : data.data[i].year
            });
        }

        for (var i = 0; i < data.legend.length; i++) {
            var newRow = [];
            newRow.push(data.legend[i].title);
            if (typeof data.needSumm !== 'undefined' && data.needSumm) {
                var summAll = 0;
                for (var j = 0; j < data.data.length; j++) {
                    if (data.data[j].values[i] !== null) {
                        summAll += data.data[j].values[i];
                    }
                }
                newRow.push(numberWithSpaces(summAll.toFixed(3)));
            }
            for (var j = 0; j < data.data.length; j++) {
                if (data.data[j].values[i] == null) {
                    newRow.push('—');
                } else {
                    newRow.push(numberWithSpaces(data.data[j].values[i]));
                }
            }
            tableData.rows.push(newRow);
        }

        createTable(curBlock, tableData, 15, 1, 'up');

    }
}

function createChartFinance(blockID, data) {
    var curBlock = $('[data-id="' + blockID + '"]');
    if (curBlock.length == 1) {
        makeChartFinance(curBlock, data);
        curBlock.parent().find('.opendata-chart-menu-item a').unbind('click');
        curBlock.parent().find('.opendata-chart-menu-item a').click(function(e) {
            var curItem = $(this).parent();
            if (!curItem.hasClass('active')) {
                curItem.parent().find('.opendata-chart-menu-item.active').removeClass('active');
                curItem.addClass('active');
                makeChartFinance(curBlock, data);
            }
            e.preventDefault();
        });
    }
}

function makeChartFinance(curBlock, data) {
    var dataType = 'chart';
    if (curBlock.parent().find('.opendata-chart-menu').length == 1) {
        dataType = curBlock.parent().find('.opendata-chart-menu .opendata-chart-menu-item.active a').attr('data-type');
    }
    var newHTML = '';

    if (dataType == 'chart') {

        newHTML +=  '<div class="opendata-chart-finance-content">' +
                        '<div class="opendata-chart-finance-graph">' +
                            '<div class="opendata-chart-finance-graph-scale-y-title">' + data.scaleYTitle + '</div>' +
                            '<div class="opendata-chart-finance-graph-scale-y"></div>' +
                            '<div class="opendata-chart-finance-graph-wrapper">' +
                                '<div class="opendata-chart-finance-graph-container">' +
                                '</div>' +
                                '<div class="opendata-chart-finance-graph-scale-x"></div>' +
                            '</div>' +
                            '<div class="opendata-chart-finance-graph-scale-x-title">' + data.scaleXTitle + '</div>' +
                        '</div>' +
                        '<div class="opendata-chart-finance-legend">';
        for (var i = 0; i < data.legend.length; i++) {
            if (i < 10) {
                newHTML +=  '<div class="opendata-chart-finance-legend-item">' +
                                data.legend[i].title +
                                '<div class="opendata-chart-finance-legend-item-color" style="background-color:' + data.legend[i].color + '"></div>' +
                            '</div>';
            }
        }
        newHTML +=      '</div>' +
                    '</div>';
        curBlock.html(newHTML);

        var curScaleX = curBlock.find('.opendata-chart-finance-graph-scale-x');

        var curGraph = curBlock.find('.opendata-chart-finance-graph-container');
        var itemWidth = 63;
        if ($(window).width() < 1120) {
            itemWidth = 55;
        }
        curGraph.css({'width': data.data.length * itemWidth + 'px'});
        if (curGraph.width() < curBlock.find('.opendata-chart-finance-graph-wrapper').width()) {
            itemWidth = curBlock.find('.opendata-chart-finance-graph-wrapper').width() / data.data.length;
        }
        curGraph.css({'width': data.data.length * itemWidth + 'px'});

        for (var i = 0; i < data.data.length; i++) {
            var itemHTML =  '<div class="opendata-chart-finance-graph-scale-x-item" style="width:' + itemWidth + 'px">' +
                                '<div class="opendata-chart-finance-graph-item-year">' + data.data[i].year + '</div>';
            itemHTML +=     '</div>';
            curScaleX.append(itemHTML);
        }

        var curScaleY = curBlock.find('.opendata-chart-finance-graph-scale-y');

        var curMax = 0;
        for (var i = 0; i < data.data.length; i++) {
            for (var j = 0; j < data.data[i].values.length; j++) {
                if (j < 10) {
                    if (curMax < Number(data.data[i].values[j])) {
                        curMax = Number(data.data[i].values[j]);
                    }
                }
            }
        }

        var countYLines = Math.ceil(curMax / Number(data.scaleYStep));
        for (var i = 0; i <= countYLines; i++) {
            curScaleY.append('<div class="opendata-chart-finance-graph-scale-y-item" style="bottom:' + (i / countYLines * 100) + '%">' + (i * Number(data.scaleYStep)) + '</div>');
        }
        curMax = countYLines * Number(data.scaleYStep);

        var itemHeight = 70;
        curScaleY.css({'height': countYLines * itemHeight + 'px'});

        for (var i = 0; i < countYLines; i++) {
            curGraph.append('<div class="opendata-chart-finance-graph-item"></div>');
        }

        for (var i = 0; i < data.data.length; i++) {
            for (var j = 0; j < data.data[i].values.length; j++) {
                if (j < 10) {
                    if (data.data[i].values[j] !== null) {
                        curGraph.append('<div class="opendata-chart-finance-graph-item-point" style="left:' + (itemWidth * i + itemWidth / 2) + 'px; bottom:' + (Number(data.data[i].values[j]) / curMax * 100) + '%; background-color:' + data.legend[j].color + '" data-id="' + j + '"></div>');
                    }
                }
            }
        }

        curBlock.find('.opendata-chart-finance-graph-wrapper').each(function() {
            $(this).mCustomScrollbar({
                axis: 'x',
                scrollButtons: {
                    enable: true
                }
            });
        });

        curBlock.find('.opendata-chart-finance-graph-item-point').on('mouseenter', function(e) {
            if ($(window).width() > 1119) {
                var curID = Number($(this).attr('data-id'));
                curBlock.find('.opendata-chart-finance-graph-item-point').addClass('other');
                curBlock.find('.opendata-chart-finance-graph-item-point[data-id="' + curID + '"]').removeClass('other');
                $('.opendata-chart-finance-hint').remove();
                var hintHTML =  '<div class="opendata-chart-finance-hint">' +
                                    '<div class="opendata-chart-finance-hint-container">' +
                                        '<div class="opendata-chart-finance-hint-title">' + data.legend[curID].title + '</div>' +
                                        '<div class="opendata-chart-finance-hint-values">';
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].values[curID] !== null) {
                        hintHTML +=         '<div class="opendata-chart-finance-hint-value">' +
                                                '<div class="opendata-chart-finance-hint-value-title">' + data.data[i].year + '</div>' +
                                                '<div class="opendata-chart-finance-hint-value-text">' + numberWithSpaces(Number(data.data[i].values[curID]).toFixed(3)) + '</div>' +
                                            '</div>';
                        if ((i + 1) % 10 == 0) {
                            hintHTML += '</div>' +
                                        '<div class="opendata-chart-finance-hint-values">';
                        }
                    }
                }
                hintHTML +=             '</div>' +
                                    '</div>' +
                                '</div>';
                $('body').append(hintHTML);
                var curLeft = $(this).offset().left;
                var curTop = $(this).offset().top;
                $('.opendata-chart-finance-hint').css({'left': curLeft, 'top': curTop});
                if ($('.opendata-chart-finance-hint').offset().left + $('.opendata-chart-finance-hint').outerWidth() > $(window).width()) {
                    $('.opendata-chart-finance-hint').addClass('right');
                }
            }
        });

        curBlock.find('.opendata-chart-finance-graph-item-point').on('click', function(e) {
            if ($(window).width() < 1120) {
                var curID = Number($(this).attr('data-id'));
                curBlock.find('.opendata-chart-finance-graph-item-point').addClass('other');
                curBlock.find('.opendata-chart-finance-graph-item-point[data-id="' + curID + '"]').removeClass('other');
                $('.opendata-chart-finance-hint').remove();
                var hintHTML =  '<div class="opendata-chart-finance-hint">' +
                                    '<div class="opendata-chart-finance-hint-bg"></div>' +
                                    '<div class="opendata-chart-finance-hint-container">' +
                                        '<div class="opendata-chart-finance-hint-title">' + data.legend[curID].title + '</div>' +
                                        '<div class="opendata-chart-finance-hint-values">';
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].values[curID] !== null) {
                        hintHTML +=         '<div class="opendata-chart-finance-hint-value">' +
                                                '<div class="opendata-chart-finance-hint-value-title">' + data.data[i].year + '</div>' +
                                                '<div class="opendata-chart-finance-hint-value-text">' + numberWithSpaces(Number(data.data[i].values[curID]).toFixed(3)) + '</div>' +
                                            '</div>';
                        if ((i + 1) % 10 == 0) {
                            hintHTML += '</div>' +
                                        '<div class="opendata-chart-finance-hint-values">';
                        }
                    }
                }
                hintHTML +=             '</div>' +
                                        '<a href="#" class="opendata-chart-finance-hint-close"></a>' +
                                    '</div>' +
                                '</div>';
                $('body').append(hintHTML);
            }
        });

        curBlock.find('.opendata-chart-finance-graph-item-point').on('mouseleave', function(e) {
            if ($(window).width() > 1119) {
                $('.opendata-chart-finance-hint').remove();
                $('.opendata-chart-finance-graph-item-point').removeClass('other');
            }
        });

    } else {

        var tableData = {
            'headers'   : [],
            'rows'      : []
        };

        tableData.headers.push({
            'size'  : 'big',
            'sort'  : true,
            'type'  : 'text',
            'text'  : data.titleTable
        });
        if (typeof data.needSumm !== 'undefined' && data.needSumm) {
            tableData.headers.push({
                'size'  : 'little',
                'sort'  : true,
                'type'  : 'number',
                'text'  : data.summTitle
            });
        }
        for (var i = 0; i < data.data.length; i++) {
            tableData.headers.push({
                'size'  : 'little',
                'sort'  : true,
                'type'  : 'number',
                'text'  : data.data[i].year
            });
        }

        for (var i = 0; i < data.legend.length; i++) {
            var newRow = [];
            newRow.push(data.legend[i].title);
            if (typeof data.needSumm !== 'undefined' && data.needSumm) {
                var summAll = 0;
                for (var j = 0; j < data.data.length; j++) {
                    if (data.data[j].values[i] !== null) {
                        summAll += data.data[j].values[i];
                    }
                }
                newRow.push(numberWithSpaces(summAll.toFixed(3)));
            }
            for (var j = 0; j < data.data.length; j++) {
                if (data.data[j].values[i] == null) {
                    newRow.push('—');
                } else {
                    newRow.push(numberWithSpaces(data.data[j].values[i]));
                }
            }
            tableData.rows.push(newRow);
        }

        createTable(curBlock, tableData, 15, 1, 'up');

    }
}

function createChartOrg(blockID, data) {
    var curBlock = $('[data-id="' + blockID + '"]');
    if (curBlock.length == 1) {
        makeChartOrg(curBlock, data);
        curBlock.parent().find('.opendata-chart-menu-item a').unbind('click');
        curBlock.parent().find('.opendata-chart-menu-item a').click(function(e) {
            var curItem = $(this).parent();
            if (!curItem.hasClass('active')) {
                curItem.parent().find('.opendata-chart-menu-item.active').removeClass('active');
                curItem.addClass('active');
                makeChartOrg(curBlock, data);
            }
            e.preventDefault();
        });
    }
}

function makeChartOrg(curBlock, data) {
    var dataType = 'chart';
    if (curBlock.parent().find('.opendata-chart-menu').length == 1) {
        dataType = curBlock.parent().find('.opendata-chart-menu .opendata-chart-menu-item.active a').attr('data-type');
    }
    var newHTML = '';

    if (dataType == 'chart') {

        function angle_point(a, b, c) {
            var x1 = a[0] - b[0];
            var x2 = c[0] - b[0];
            var y1 = a[1] - b[1];
            var y2 = c[1] - b[1];

            var d1 = Math.sqrt(x1 * x1 + y1 * y1);
            var d2 = Math.sqrt(x2 * x2 + y2 * y2);
            return Math.acos((x1 * x2 + y1 * y2) / (d1 * d2)) * 180 / Math.PI;
        }
        curBlock.html('');

        var curRightSwitch = '';
        for (var i = 0; i < data.legend.length; i++) {
            if (data.legend[i].type == 'right') {
                if (curRightSwitch == '') {
                    curRightSwitch =    '<div class="opendata-chart-org-right-switch">' +
                                            '<div class="opendata-chart-org-right-switch-inner">';
                }
                curRightSwitch +=               '<div class="opendata-chart-org-right-switch-item" data-id="' + i + '"><a href="#">' + data.legend[i].title + '</a></div>';
            }
        }
        if (curRightSwitch != '') {
            curRightSwitch +=               '</div>' +
                                        '</div>';
        }

        newHTML +=  '<div class="opendata-chart-org-content">' +
                        curRightSwitch +
                        '<div class="opendata-chart-org-graph">' +
                            '<div class="opendata-chart-org-graph-scale-left-title">' + data.scaleLeftTitle + '</div>' +
                            '<div class="opendata-chart-org-graph-scale-left"></div>' +
                            '<div class="opendata-chart-org-graph-scale-right-title">' + data.scaleRightTitle + '</div>' +
                            '<div class="opendata-chart-org-graph-scale-right"></div>' +
                            '<div class="opendata-chart-org-graph-wrapper">' +
                                '<div class="opendata-chart-org-graph-container">' +
                                '</div>' +
                                '<div class="opendata-chart-org-graph-scale-x"></div>' +
                            '</div>' +
                            '<div class="opendata-chart-org-graph-scale-x-title">' + data.scaleXTitle + '</div>' +
                        '</div>' +
                        '<div class="opendata-chart-org-legend">';
        for (var i = 0; i < data.legend.length; i++) {
            newHTML +=  '<div class="opendata-chart-org-legend-item ' + data.legend[i].type + '">' +
                            data.legend[i].title +
                            '<div class="opendata-chart-org-legend-item-color" style="background-color:' + data.legend[i].color + '"></div>' +
                        '</div>';
        }
        newHTML +=      '</div>' +
                    '</div>';
        curBlock.append(newHTML);

        if (curRightSwitch != '') {
            if (curBlock.data('right') === undefined) {
                curBlock.data('right', curBlock.find('.opendata-chart-org-right-switch-item').eq(0).attr('data-id'));
            }
            curBlock.find('.opendata-chart-org-right-switch-item[data-id="' + curBlock.data('right') + '"]').addClass('active');

            var curRight = curBlock.data('right');
        }

        curBlock.find('.opendata-chart-org-right-switch-item a').click(function(e) {
            var curItem = $(this).parent();
            if (!curItem.hasClass('active')) {
                curItem.parent().find('.opendata-chart-org-right-switch-item.active').removeClass('active');
                curItem.addClass('active');
                curItem.parents().find('.opendata-chart-container').data('right', curItem.attr('data-id'));
                makeChartOrg(curBlock, data);
            }
            e.preventDefault();
        });

        var curScaleX = curBlock.find('.opendata-chart-org-graph-scale-x');

        for (var i = 0; i < data.data.length; i++) {
            var itemHTML =  '<div class="opendata-chart-org-graph-scale-x-item">' +
                                '<div class="opendata-chart-org-graph-item-year">' + data.data[i].year + '</div>';
            itemHTML +=     '</div>';
            curScaleX.append(itemHTML);
        }

        var itemHeight = 70;

        var curScaleLeft = curBlock.find('.opendata-chart-org-graph-scale-left');

        var curMaxLeft = 0;
        for (var i = 0; i < data.data.length; i++) {
            for (var j = 0; j < data.data[i].values.length; j++) {
                if (data.legend[j].type == 'left') {
                    if (curMaxLeft < Number(data.data[i].values[j])) {
                        curMaxLeft = Number(data.data[i].values[j]);
                    }
                }
            }
        }

        var countLeftLines = Math.ceil(curMaxLeft / Number(data.scaleLeftStep));
        for (var i = 0; i <= countLeftLines; i++) {
            curScaleLeft.append('<div class="opendata-chart-org-graph-scale-left-item" style="bottom:' + (i / countLeftLines * 100) + '%">' + numberWithSpaces(i * Number(data.scaleLeftStep)) + '</div>');
        }
        curMaxLeft = countLeftLines * Number(data.scaleLeftStep);

        curScaleLeft.css({'height': countLeftLines * itemHeight + 'px'});

        var curScaleRight = curBlock.find('.opendata-chart-org-graph-scale-right');

        var curMaxRight = 0;
        for (var i = 0; i < data.data.length; i++) {
            for (var j = 0; j < data.data[i].values.length; j++) {
                if (data.legend[j].type == 'right' && j == curRight) {
                    if (curMaxRight < Number(data.data[i].values[j])) {
                        curMaxRight = Number(data.data[i].values[j]);
                    }
                }
            }
        }

        var countRightLines = Math.ceil(curMaxRight / Number(data.legend[curRight].scaleRightStep));
        for (var i = 0; i <= countRightLines; i++) {
            var curRightValue = i * Number(data.legend[curRight].scaleRightStep);
            if (String(curRightValue).indexOf('.') > -1) {
                curRightValue = curRightValue.toFixed(1);
            }
            curScaleRight.append('<div class="opendata-chart-org-graph-scale-right-item" style="bottom:' + (i / countRightLines * 100) + '%">' + numberWithSpaces(curRightValue) + '</div>');
        }
        curMaxRight = countRightLines * Number(data.legend[curRight].scaleRightStep);

        curScaleRight.css({'height': countLeftLines * itemHeight + 'px'});

        var curGraph = curBlock.find('.opendata-chart-org-graph-container');
        for (var i = 0; i < countLeftLines; i++) {
            curGraph.append('<div class="opendata-chart-org-graph-item"></div>');
        }

        var itemWidth = 63;
        curGraph.css({'width': data.data.length * itemWidth + 'px'});

        for (var i = 0; i < data.data.length; i++) {
            var itemHTML = '';
            var itemBarHTML = '';
            for (var j = 0; j < data.data[i].values.length; j++) {
                if (data.legend[j].type == 'left') {
                    itemBarHTML += '<div class="opendata-chart-org-graph-item-bar-item" style="transform:translateX(' + (j * 10) + 'px); background-color:' + data.legend[j].color + '; height:' + (Number(data.data[i].values[j]) / curMaxLeft * 100) + '%"></div>';
                }
            }
            itemHTML += '<div class="opendata-chart-org-graph-item-bar" style="left:' + (itemWidth * i) + 'px" data-year="' + i + '">' + itemBarHTML + '</div>';
            curGraph.append(itemHTML);
        }

        for (var i = 0; i < data.legend.length; i++) {
            var lineDots = [];
            for (var j = 0; j < data.data.length; j++) {
                if (data.legend[i].type == 'right' && i == curRight) {
                    if (data.data[j].values[i] !== null) {
                        lineDots.push({'year': j, 'value': Number(data.data[j].values[i])});
                    }
                }
            }

            for (var j = 0; j < lineDots.length; j++) {
                var curX = lineDots[j].year * itemWidth + itemWidth / 2;
                var curY = curScaleRight.height() - (curScaleRight.height() * (lineDots[j].value / curMaxRight)) + 10;
                if (j > 0) {
                    var prevX = lineDots[j - 1].year * itemWidth + itemWidth / 2;
                    var prevY = curScaleRight.height() - curScaleRight.height() * (lineDots[j - 1].value / curMaxRight) + 10;
                    var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                    var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                    if (curY < prevY) {
                        curAngle = -curAngle;
                    }
                    curGraph.append('<div class="opendata-chart-org-graph-item-point-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg); border-top-color:' + data.legend[i].color + '"></div>');
                }
            }
        }

        for (var i = 0; i < data.data.length; i++) {
            for (var j = 0; j < data.data[i].values.length; j++) {
                if (data.legend[j].type == 'right' && j == curRight) {
                    if (data.data[i].values[j] !== null) {
                        curGraph.append('<div class="opendata-chart-org-graph-item-point" style="left:' + (itemWidth * i) + 'px; bottom:' + (Number(data.data[i].values[j]) / curMaxRight * 100) + '%; border-color:' + data.legend[j].color + '" data-year="' + i + '"></div>');
                    }
                }
            }
        }

        curBlock.find('.opendata-chart-org-graph-wrapper').each(function() {
            $(this).mCustomScrollbar({
                axis: 'x',
                scrollButtons: {
                    enable: true
                }
            });
        });

        curBlock.find('.opendata-chart-org-graph-item-point, .opendata-chart-org-graph-item-bar').on('mouseenter', function(e) {
            if ($(window).width() > 1119) {
                var curYear = Number($(this).attr('data-year'));
                $('.opendata-chart-org-hint').remove();
                var hintHTML =  '<div class="opendata-chart-org-hint">' +
                                    '<div class="opendata-chart-org-hint-container">' +
                                        '<div class="opendata-chart-org-hint-title">' + data.data[curYear].year + ' г</div>' +
                                        '<div class="opendata-chart-org-hint-values">';
                for (var i = 0; i < data.legend.length; i++) {
                    hintHTML +=     '<div class="opendata-chart-org-hint-value">' +
                                        '<div class="opendata-chart-org-hint-value-color"><div class="opendata-chart-org-hint-value-color-inner ' + data.legend[i].type + '" style="background-color:' + data.legend[i].color + '"></div></div>' +
                                        '<div class="opendata-chart-org-hint-value-title">' + data.legend[i].title + '</div>' +
                                        '<div class="opendata-chart-org-hint-value-text">' + numberWithSpaces(data.data[curYear].values[i]) + '</div>' +
                                    '</div>';
                }
                hintHTML +=             '</div>' +
                                    '</div>' +
                                '</div>';
                $('body').append(hintHTML);
                var curLeft = $(this).offset().left + $(this).width() / 2;
                var curTop = $(this).offset().top + $(this).height() / 2;
                $('.opendata-chart-org-hint').css({'left': curLeft, 'top': curTop});
                if ($('.opendata-chart-org-hint').offset().left + $('.opendata-chart-org-hint').outerWidth() > $(window).width()) {
                    $('.opendata-chart-org-hint').addClass('right');
                }
            }
        });

        curBlock.find('.opendata-chart-org-graph-item-point, .opendata-chart-org-graph-item-bar').on('click', function(e) {
            if ($(window).width() < 1120) {
                var curYear = Number($(this).attr('data-year'));
                $('.opendata-chart-org-hint').remove();
                var hintHTML =  '<div class="opendata-chart-org-hint">' +
                                    '<div class="opendata-chart-org-hint-bg"></div>' +
                                    '<div class="opendata-chart-org-hint-container">' +
                                        '<div class="opendata-chart-org-hint-title">' + data.data[curYear].year + ' г</div>' +
                                        '<div class="opendata-chart-org-hint-values">';
                for (var i = 0; i < data.legend.length; i++) {
                    hintHTML +=     '<div class="opendata-chart-org-hint-value">' +
                                        '<div class="opendata-chart-org-hint-value-color"><div class="opendata-chart-org-hint-value-color-inner ' + data.legend[i].type + '" style="background-color:' + data.legend[i].color + '"></div></div>' +
                                        '<div class="opendata-chart-org-hint-value-title">' + data.legend[i].title + '</div>' +
                                        '<div class="opendata-chart-org-hint-value-text">' + numberWithSpaces(data.data[curYear].values[i]) + '</div>' +
                                    '</div>';
                }
                hintHTML +=             '</div>' +
                                        '<a href="#" class="opendata-chart-org-hint-close"></a>' +
                                    '</div>' +
                                '</div>';
                $('body').append(hintHTML);
            }
        });

        curBlock.find('.opendata-chart-org-graph-item-point, .opendata-chart-org-graph-item-bar').on('mouseleave', function(e) {
            if ($(window).width() > 1119) {
                $('.opendata-chart-org-hint').remove();
            }
        });

    } else {

        var tableData = {
            'headers'   : [],
            'rows'      : []
        };

        tableData.headers.push({
            'size'  : 'big',
            'sort'  : true,
            'type'  : 'text',
            'text'  : data.titleTable
        });
        if (typeof data.needSumm !== 'undefined' && data.needSumm) {
            tableData.headers.push({
                'size'  : 'little',
                'sort'  : true,
                'type'  : 'number',
                'text'  : data.summTitle
            });
        }
        for (var i = 0; i < data.data.length; i++) {
            tableData.headers.push({
                'size'  : 'little',
                'sort'  : true,
                'type'  : 'number',
                'text'  : data.data[i].year
            });
        }

        for (var i = 0; i < data.legend.length; i++) {
            var newRow = [];
            newRow.push(data.legend[i].title);
            if (typeof data.needSumm !== 'undefined' && data.needSumm) {
                var summAll = 0;
                for (var j = 0; j < data.data.length; j++) {
                    if (data.data[j].values[i] !== null) {
                        summAll += data.data[j].values[i];
                    }
                }
                newRow.push(numberWithSpaces(summAll.toFixed(3)));
            }
            for (var j = 0; j < data.data.length; j++) {
                if (data.data[j].values[i] == null) {
                    newRow.push('—');
                } else {
                    newRow.push(numberWithSpaces(data.data[j].values[i]));
                }
            }
            tableData.rows.push(newRow);
        }

        createTable(curBlock, tableData);

    }
}

function numberWithSpaces(x) {
    var parts = x.toString().split('.');
    parts[0] = parts[0].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;');
    return parts.join('.');
}

$(document).ready(function() {

    $('body').on('mouseenter', '.opendata-chart-forecast-graph-item-bar', function(e) {
        if ($(window).width() > 1119) {
            var curItemBar = $(this);
            $('.opendata-chart-map-region-hint').remove();
            var windowHTML = '<div class="opendata-chart-map-region-hint">' +
                                 '<div class="opendata-chart-map-region-hint-container">' +
                                    '<div class="opendata-chart-map-region-hint-title">' + $(this).find('.opendata-chart-forecast-graph-item-bar-item').eq(0).attr('data-name') + '</div>' +
                                    '<div class="opendata-chart-map-region-hint-values">';
            var curSumm = 0;
            curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').each(function() {
                curSumm += Number($(this).attr('data-value'));
            });
            var summPercent = 0;
            curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').each(function() {
                var newPercent = Math.round(Number($(this).attr('data-value')) / curSumm * 100);
                if (curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').index($(this)) == curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').length - 1) {
                    newPercent = 100 - summPercent;
                } else {
                    summPercent += newPercent;
                }
                windowHTML +=           '<div class="opendata-chart-map-region-hint-value">' +
                                            '<div class="opendata-chart-map-region-hint-value-legend">' +
                                                '<div class="opendata-chart-map-region-hint-value-legend-inner" style="background:' + $(this).css('background-color') + '"></div>' +
                                            '</div>'+
                                            '<div class="opendata-chart-map-region-hint-value-title">' + $(this).attr('data-title') + ':</div>' +
                                            '<div class="opendata-chart-map-region-hint-value-text">' + numberWithSpaces($(this).attr('data-value')).replace('.', ',') + '</div>' +
                                            '<div class="opendata-chart-map-region-hint-value-percent">' + newPercent + '%</div>' +
                                        '</div>';
            });

            windowHTML +=           '</div>' +
                                    '<div class="opendata-chart-map-region-hint-pie">' +
                                        '<canvas></canvas>' +
                                    '</div>' +
                                '</div>' +
                             '</div>';
            $('body').append(windowHTML);
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.opendata-chart-map-region-hint').css({'left': curLeft, 'top': curTop});

            var pieWidth = 126;
            var pieHeight = 126;

            var canvas = $('.opendata-chart-map-region-hint-pie canvas')[0];
            var context = canvas.getContext('2d');

			canvas.width = pieWidth;
            canvas.height = pieHeight;

            var summPercent = 0;
            var currentAngle = -0.5 * Math.PI;
            curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').each(function() {
                var newPercent = Math.round(Number($(this).attr('data-value')) / curSumm * 100);
                if (curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').index($(this)) == curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').length - 1) {
                    newPercent = 100 - summPercent;
                }
                var sliceAngle = newPercent / 100 * 2 * Math.PI;
                context.beginPath();
                context.fillStyle = $(this).css('background-color');
                context.strokeStyle = $(this).css('background-color');
                context.moveTo(pieWidth / 2, pieHeight / 2);
                context.arc(pieWidth / 2, pieHeight / 2, pieWidth / 2, currentAngle, currentAngle + sliceAngle);
                context.lineTo(pieWidth / 2, pieHeight / 2);
                context.fill();
                if (newPercent > 9) {
                    $('.opendata-chart-map-region-hint-pie').append('<div class="opendata-chart-map-region-hint-pie-legend" style="transform:rotate(' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)"><span style="transform:translate(-50%, 0) rotate(-' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)">' + newPercent + '%</span></div>');
                } else {
                    $('.opendata-chart-map-region-hint-pie').append('<div class="opendata-chart-map-region-hint-pie-legend opendata-chart-map-region-hint-pie-legend-out" style="transform:rotate(' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)"><span style="transform:translate(-50%, 0) rotate(-' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)">' + newPercent + '%</span></div>');
                }
                currentAngle += sliceAngle;
                if (curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').index($(this)) != curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').length - 1) {
                    summPercent += newPercent;
                }
            });
        }
    });

    $('body').on('mouseenter', '.opendata-chart-forecast-graph-item-year', function(e) {
        if ($(window).width() > 1119) {
            var curItemBar = $(this).parent().find('.opendata-chart-forecast-graph-item-bar');
            $('.opendata-chart-map-region-hint').remove();
            var windowHTML = '<div class="opendata-chart-map-region-hint">' +
                                 '<div class="opendata-chart-map-region-hint-container">' +
                                    '<div class="opendata-chart-map-region-hint-title">' + $(this).parent().find('.opendata-chart-forecast-graph-item-bar').find('.opendata-chart-forecast-graph-item-bar-item').eq(0).attr('data-name') + '</div>' +
                                    '<div class="opendata-chart-map-region-hint-values">';
            var curSumm = 0;
            curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').each(function() {
                curSumm += Number($(this).attr('data-value'));
            });
            var summPercent = 0;
            $(this).parent().find('.opendata-chart-forecast-graph-item-bar').find('.opendata-chart-forecast-graph-item-bar-item').each(function() {
                var newPercent = Math.round(Number($(this).attr('data-value')) / curSumm * 100);
                if (curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').index($(this)) == curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').length - 1) {
                    newPercent = 100 - summPercent;
                } else {
                    summPercent += newPercent;
                }
                windowHTML +=           '<div class="opendata-chart-map-region-hint-value">' +
                                            '<div class="opendata-chart-map-region-hint-value-legend">' +
                                                '<div class="opendata-chart-map-region-hint-value-legend-inner" style="background:' + $(this).css('background-color') + '"></div>' +
                                            '</div>'+
                                            '<div class="opendata-chart-map-region-hint-value-title">' + $(this).attr('data-title') + ':</div>' +
                                            '<div class="opendata-chart-map-region-hint-value-text">' + numberWithSpaces($(this).attr('data-value')).replace('.', ',') + '</div>' +
                                            '<div class="opendata-chart-map-region-hint-value-percent">' + newPercent + '%</div>' +
                                        '</div>';
            });

            windowHTML +=           '</div>' +
                                    '<div class="opendata-chart-map-region-hint-pie">' +
                                        '<canvas></canvas>' +
                                    '</div>' +
                                '</div>' +
                             '</div>';
            $('body').append(windowHTML);
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.opendata-chart-map-region-hint').css({'left': curLeft, 'top': curTop});

            var pieWidth = 126;
            var pieHeight = 126;

            var canvas = $('.opendata-chart-map-region-hint-pie canvas')[0];
            var context = canvas.getContext('2d');

			canvas.width = pieWidth;
            canvas.height = pieHeight;

            var summPercent = 0;
            var currentAngle = -0.5 * Math.PI;
            curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').each(function() {
                var newPercent = Math.round(Number($(this).attr('data-value')) / curSumm * 100);
                if (curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').index($(this)) == curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').length - 1) {
                    newPercent = 100 - summPercent;
                }
                var sliceAngle = newPercent / 100 * 2 * Math.PI;
                context.beginPath();
                context.fillStyle = $(this).css('background-color');
                context.strokeStyle = $(this).css('background-color');
                context.moveTo(pieWidth / 2, pieHeight / 2);
                context.arc(pieWidth / 2, pieHeight / 2, pieWidth / 2, currentAngle, currentAngle + sliceAngle);
                context.lineTo(pieWidth / 2, pieHeight / 2);
                context.fill();
                if (newPercent > 9) {
                    $('.opendata-chart-map-region-hint-pie').append('<div class="opendata-chart-map-region-hint-pie-legend" style="transform:rotate(' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)"><span style="transform:translate(-50%, 0) rotate(-' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)">' + newPercent + '%</span></div>');
                } else {
                    $('.opendata-chart-map-region-hint-pie').append('<div class="opendata-chart-map-region-hint-pie-legend opendata-chart-map-region-hint-pie-legend-out" style="transform:rotate(' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)"><span style="transform:translate(-50%, 0) rotate(-' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)">' + newPercent + '%</span></div>');
                }
                currentAngle += sliceAngle;
                if (curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').index($(this)) != curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').length - 1) {
                    summPercent += newPercent;
                }
            });
        }
    });

    $('body').on('click', '.opendata-chart-forecast-graph-item-bar', function(e) {
        if ($(window).width() < 1120) {
            $('.opendata-chart-map-region-hint').remove();
            var curItemBar = $(this);
            var windowHTML = '<div class="opendata-chart-map-region-hint">' +
                                 '<div class="opendata-chart-map-region-hint-bg"></div>' +
                                 '<div class="opendata-chart-map-region-hint-container">' +
                                    '<div class="opendata-chart-map-region-hint-title">' + $(this).find('.opendata-chart-forecast-graph-item-bar-item').eq(0).attr('data-name') + '</div>' +
                                    '<div class="opendata-chart-map-region-hint-values">';
            var curSumm = 0;
            curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').each(function() {
                curSumm += Number($(this).attr('data-value'));
            });
            var summPercent = 0;
            $(this).find('.opendata-chart-forecast-graph-item-bar-item').each(function() {
                var newPercent = Math.round(Number($(this).attr('data-value')) / curSumm * 100);
                if (curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').index($(this)) == curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').length - 1) {
                    newPercent = 100 - summPercent;
                } else {
                    summPercent += newPercent;
                }
                windowHTML +=           '<div class="opendata-chart-map-region-hint-value">' +
                                            '<div class="opendata-chart-map-region-hint-value-legend">' +
                                                '<div class="opendata-chart-map-region-hint-value-legend-inner" style="background:' + $(this).css('background-color') + '"></div>' +
                                            '</div>'+
                                            '<div class="opendata-chart-map-region-hint-value-title">' + $(this).attr('data-title') + ':</div>' +
                                            '<div class="opendata-chart-map-region-hint-value-text">' + numberWithSpaces($(this).attr('data-value')).replace('.', ',') + '</div>' +
                                            '<div class="opendata-chart-map-region-hint-value-percent">' + newPercent + '%</div>' +
                                        '</div>';
            });

            windowHTML +=           '</div>' +
                                    '<div class="opendata-chart-map-region-hint-pie">' +
                                        '<canvas></canvas>' +
                                    '</div>' +
                                    '<a href="#" class="opendata-chart-map-region-hint-close"></a>' +
                                 '</div>' +
                             '</div>';
            $('body').append(windowHTML);

            var pieWidth = 126;
            var pieHeight = 126;

            var canvas = $('.opendata-chart-map-region-hint-pie canvas')[0];
            var context = canvas.getContext('2d');

			canvas.width = pieWidth;
            canvas.height = pieHeight;

            var summPercent = 0;
            var currentAngle = -0.5 * Math.PI;
            curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').each(function() {
                var newPercent = Math.round(Number($(this).attr('data-value')) / curSumm * 100);
                if (curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').index($(this)) == curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').length - 1) {
                    newPercent = 100 - summPercent;
                }
                var sliceAngle = newPercent / 100 * 2 * Math.PI;
                context.beginPath();
                context.fillStyle = $(this).css('background-color');
                context.strokeStyle = $(this).css('background-color');
                context.moveTo(pieWidth / 2, pieHeight / 2);
                context.arc(pieWidth / 2, pieHeight / 2, pieWidth / 2, currentAngle, currentAngle + sliceAngle);
                context.lineTo(pieWidth / 2, pieHeight / 2);
                context.fill();
                if (newPercent > 9) {
                    $('.opendata-chart-map-region-hint-pie').append('<div class="opendata-chart-map-region-hint-pie-legend" style="transform:rotate(' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)"><span style="transform:translate(-50%, 0) rotate(-' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)">' + newPercent + '%</span></div>');
                } else {
                    $('.opendata-chart-map-region-hint-pie').append('<div class="opendata-chart-map-region-hint-pie-legend opendata-chart-map-region-hint-pie-legend-out" style="transform:rotate(' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)"><span style="transform:translate(-50%, 0) rotate(-' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)">' + newPercent + '%</span></div>');
                }
                currentAngle += sliceAngle;
                if (curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').index($(this)) != curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').length - 1) {
                    summPercent += newPercent;
                }
            });
        }
    });

    $('body').on('click', '.opendata-chart-forecast-graph-item-year', function(e) {
        if ($(window).width() < 1120) {
            var curItemBar = $(this).parent().find('.opendata-chart-forecast-graph-item-bar');
            $('.opendata-chart-map-region-hint').remove();
            var windowHTML = '<div class="opendata-chart-map-region-hint">' +
                                 '<div class="opendata-chart-map-region-hint-bg"></div>' +
                                 '<div class="opendata-chart-map-region-hint-container">' +
                                    '<div class="opendata-chart-map-region-hint-title">' + $(this).parent().find('.opendata-chart-forecast-graph-item-bar').find('.opendata-chart-forecast-graph-item-bar-item').eq(0).attr('data-name') + '</div>' +
                                    '<div class="opendata-chart-map-region-hint-values">';
            var curSumm = 0;
            curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').each(function() {
                curSumm += Number($(this).attr('data-value'));
            });
            var summPercent = 0;
            $(this).parent().find('.opendata-chart-forecast-graph-item-bar').find('.opendata-chart-forecast-graph-item-bar-item').each(function() {
                var newPercent = Math.round(Number($(this).attr('data-value')) / curSumm * 100);
                if (curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').index($(this)) == curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').length - 1) {
                    newPercent = 100 - summPercent;
                } else {
                    summPercent += newPercent;
                }
                windowHTML +=           '<div class="opendata-chart-map-region-hint-value">' +
                                            '<div class="opendata-chart-map-region-hint-value-legend">' +
                                                '<div class="opendata-chart-map-region-hint-value-legend-inner" style="background:' + $(this).css('background-color') + '"></div>' +
                                            '</div>'+
                                            '<div class="opendata-chart-map-region-hint-value-title">' + $(this).attr('data-title') + ':</div>' +
                                            '<div class="opendata-chart-map-region-hint-value-text">' + numberWithSpaces($(this).attr('data-value')).replace('.', ',') + '</div>' +
                                            '<div class="opendata-chart-map-region-hint-value-percent">' + newPercent + '%</div>' +
                                        '</div>';
            });

            windowHTML +=           '</div>' +
                                    '<div class="opendata-chart-map-region-hint-pie">' +
                                        '<canvas></canvas>' +
                                    '</div>' +
                                    '<a href="#" class="opendata-chart-map-region-hint-close"></a>' +
                                 '</div>' +
                             '</div>';
            $('body').append(windowHTML);

            var pieWidth = 126;
            var pieHeight = 126;

            var canvas = $('.opendata-chart-map-region-hint-pie canvas')[0];
            var context = canvas.getContext('2d');

			canvas.width = pieWidth;
            canvas.height = pieHeight;

            var summPercent = 0;
            var currentAngle = -0.5 * Math.PI;
            curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').each(function() {
                var newPercent = Math.round(Number($(this).attr('data-value')) / curSumm * 100);
                if (curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').index($(this)) == curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').length - 1) {
                    newPercent = 100 - summPercent;
                }
                var sliceAngle = newPercent / 100 * 2 * Math.PI;
                context.beginPath();
                context.fillStyle = $(this).css('background-color');
                context.strokeStyle = $(this).css('background-color');
                context.moveTo(pieWidth / 2, pieHeight / 2);
                context.arc(pieWidth / 2, pieHeight / 2, pieWidth / 2, currentAngle, currentAngle + sliceAngle);
                context.lineTo(pieWidth / 2, pieHeight / 2);
                context.fill();
                if (newPercent > 9) {
                    $('.opendata-chart-map-region-hint-pie').append('<div class="opendata-chart-map-region-hint-pie-legend" style="transform:rotate(' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)"><span style="transform:translate(-50%, 0) rotate(-' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)">' + newPercent + '%</span></div>');
                } else {
                    $('.opendata-chart-map-region-hint-pie').append('<div class="opendata-chart-map-region-hint-pie-legend opendata-chart-map-region-hint-pie-legend-out" style="transform:rotate(' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)"><span style="transform:translate(-50%, 0) rotate(-' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)">' + newPercent + '%</span></div>');
                }
                currentAngle += sliceAngle;
                if (curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').index($(this)) != curItemBar.find('.opendata-chart-forecast-graph-item-bar-item').length - 1) {
                    summPercent += newPercent;
                }
            });
        }
    });

    $('body').on('mousemove', '.opendata-chart-forecast-graph-item-bar', function(e) {
        if ($(window).width() > 1119) {
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.opendata-chart-map-region-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('mousemove', '.opendata-chart-forecast-graph-item-year', function(e) {
        if ($(window).width() > 1119) {
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.opendata-chart-map-region-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('mouseleave', '.opendata-chart-forecast-graph-item-bar', function(e) {
        if ($(window).width() > 1119) {
            $('.opendata-chart-map-region-hint').remove();
        }
    });

    $('body').on('mouseleave', '.opendata-chart-forecast-graph-item-year', function(e) {
        if ($(window).width() > 1119) {
            $('.opendata-chart-map-region-hint').remove();
        }
    });

    $('body').on('mouseover', '.opendata-chart-forecast-legend-item-title', function(e) {
        var curTitle = $(this);
        if (curTitle.find('.opendata-chart-forecast-legend-item-title-short').height() >= curTitle.find('.opendata-chart-forecast-legend-item-title-full').height()) {
            curTitle.find('.opendata-chart-forecast-legend-item-title-full').css({'display': 'none'});
        }
    });

    $('body').on('mouseout', '.opendata-chart-forecast-legend-item-title', function(e) {
        var curTitle = $(this);
        curTitle.find('.opendata-chart-forecast-legend-item-title-full').css({'display': 'block'});
    });

});

function createChartBarForecast(blockID, data) {
    var curBlock = $('[data-id="' + blockID + '"]');
    if (curBlock.length == 1) {
        makeChartBarForecast(curBlock, data);
    }
}

function makeChartBarForecast(curBlock, data) {
    var newHTML = '';

    newHTML +=  '<div class="opendata-chart-forecast-content">' +
                    '<div class="opendata-chart-forecast-graph-scale-left-title">' + data.scaleLeftTitle + '</div>' +
                    '<div class="opendata-chart-forecast-graph">' +
                        '<div class="opendata-chart-forecast-graph-wrap">' +
                            '<div class="opendata-chart-forecast-graph-container">' +
                                '<div class="opendata-chart-forecast-graph-scale"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="opendata-chart-forecast-legend">';
    for (var i = data.legend.length - 1; i >= 0; i--) {
        newHTML +=      '<div class="opendata-chart-forecast-legend-item">' +
                            '<div class="opendata-chart-forecast-legend-item-title"><div class="opendata-chart-forecast-legend-item-title-short">' + data.legend[i].title + '</div><div class="opendata-chart-forecast-legend-item-title-full">' + data.legend[i].title + '</div></div>' +
                            '<div class="opendata-chart-forecast-legend-item-color" style="background-color:' + data.legend[i].color + '"></div>' +
                        '</div>';
    }
    if (typeof data.notice !== 'undefined') {
        newHTML +=      '<div class="opendata-chart-forecast-legend-notice"><span>*</span> ' + data.notice + '</div>';
    }
    newHTML +=      '</div>' +
                '</div>';
    curBlock.html(newHTML);
    var curMax = 0;
    for (var i = 0; i < data.data.length; i++) {
        var curSumm = 0;
        for (var j = 0; j < data.data[i].values.length; j++) {
            curSumm += Number(data.data[i].values[j]);
        }
        if (curMax < curSumm) {
            curMax = curSumm;
        }
    }

    var curScale = curBlock.find('.opendata-chart-forecast-graph-scale');
    var scaleTicks = Math.ceil(curMax / (Number(data.scaleStep)));
    var scaleMax = scaleTicks * (Number(data.scaleStep));

    curScale.append('<div class="opendata-chart-forecast-graph-scale-sizer">' + scaleMax + '</div>');

    curScale.append('<div class="opendata-chart-forecast-graph-scale-tick bottom" style="bottom:0%"></div>');
    for (var i = 1; i <= scaleTicks; i++) {
        var tickClass = '';
        if (i % 2 != 0) {
            tickClass = 'step';
        }
        curScale.append('<div class="opendata-chart-forecast-graph-scale-title" style="bottom:' + (i / scaleTicks * 100) + '%">' + (i * Number(data.scaleStep)) + '</div>');
        curScale.append('<div class="opendata-chart-forecast-graph-scale-tick ' + tickClass + '" style="bottom:' + (i / scaleTicks * 100) + '%"></div>');
    }

    var curGraph = curBlock.find('.opendata-chart-forecast-graph-container');

    var curForecastYear = -1;
    for (var i = 0; i < data.data.length; i++) {
        if (curForecastYear == -1 && data.data[i].type == 'forecast') {
            curForecastYear = i;
        }
    }
    curGraph.append('<div class="opendata-chart-forecast-graph-forecast-sep" style="left:' + (curForecastYear / data.data.length * 100) + '%"></div>');
    curGraph.append('<div class="opendata-chart-forecast-graph-forecast-title" style="left:0; width:' + (curForecastYear / data.data.length * 100) + '%">' + data.titleActually + '</div>');
    curGraph.append('<div class="opendata-chart-forecast-graph-forecast-title" style="left:' + (curForecastYear / data.data.length * 100) + '%; right:0">' + data.titleForecast + '<span>*</span></div>');

    for (var i = 0; i < data.data.length; i++) {
        var itemHTML =  '<div class="opendata-chart-forecast-graph-item">' +
                            '<div class="opendata-chart-forecast-graph-item-year">' + data.data[i].year + '</div>';
        var curSumm = 0;
        for (var j = 0; j < data.data[i].values.length; j++) {
            if (data.data[i].values[j] !== null) {
                curSumm += Number(data.data[i].values[j]);
            }
        }
        var itemBarHTML = '';
        var tmpSumm = 0;
        for (var j = 0; j < data.data[i].values.length; j++) {
            if (data.data[i].values[j] !== null) {
                var classTop = '';
                if (Number(data.data[i].values[j]) <= 1) {
                    classTop = ' top';
                }
                itemBarHTML +=      '<div class="opendata-chart-forecast-graph-item-bar-item' + classTop + '" style="background-color:' + data.legend[j].color + '; bottom:' + tmpSumm + '%; height:' + (Number(data.data[i].values[j]) / curSumm * 100) + '%" data-title="' + data.legend[j].title + '" data-value="' + data.data[i].values[j] + '" data-name="' + data.chartTitle + '"><span>' + (String(data.data[i].values[j]).replace('.', ',')) + '</span></div>';
                tmpSumm += Number(data.data[i].values[j]) / curSumm * 100;
            }
        }
        itemHTML +=         '<div class="opendata-chart-forecast-graph-item-bar" style="height:' + (curSumm / scaleMax * 100) + '%">' + itemBarHTML + '</div>';
        itemHTML +=     '</div>';
        curGraph.append(itemHTML);
    }

    curBlock.find('.opendata-chart-forecast-graph').each(function() {
        $(this).mCustomScrollbar({
            axis: 'x',
            scrollButtons: {
                enable: true
            }
        });
    });
}

$(window).on('load resize scroll', function() {
    $('.opendata-chart-bubble-content .mCSB_scrollTools').each(function() {
        var curTools = $(this);
        var curBlock = curTools.parent();
        if ($(window).scrollTop() + $(window).height() > curBlock.offset().top) {
            var curBottom = ($(window).scrollTop() + $(window).height()) - (curBlock.offset().top + curBlock.height() - 39);
            if (curBottom < 39) {
                curBottom = 39;
            }
            curTools.css({'position': 'fixed', 'z-index': 2, 'left': curBlock.offset().left, 'bottom': curBottom, 'right': 'auto', 'width': curBlock.width()});
        } else {
            curTools.css({'position': 'absolute', 'left': 0, 'bottom': 0, 'right': '0', 'width': 'auto'});
        }
    });

    $('.table-scroll .mCSB_scrollTools').each(function() {
        var curTools = $(this);
        var curBlock = curTools.parent();
        if ($(window).scrollTop() + $(window).height() > curBlock.offset().top) {
            var curBottom = ($(window).scrollTop() + $(window).height()) - (curBlock.offset().top + curBlock.height() - 39);
            if (curBottom < 39) {
                curBottom = 39;
            }
            var curMargin = 0;
            if (curTools.parents().filter('.opendata-table').length == 1) {
                curMargin = 480;
            }
            curTools.css({'position': 'fixed', 'z-index': 2, 'left': curBlock.offset().left, 'bottom': curBottom, 'right': 'auto', 'width': (curBlock.width() - curMargin)});
        } else {
            curTools.css({'position': 'absolute', 'left': 0, 'bottom': 0, 'right': '0', 'width': 'auto'});
        }
    });

    $('.opendata-chart-bubble-content .opendata-chart-bubble-graph-years-fixed').each(function() {
        var curYears = $(this);
        var curBlock = curYears.parent();
        if (($(window).scrollTop() + $(window).height() > curBlock.offset().top) && ($(window).scrollTop() + $(window).height() < curBlock.find('.opendata-chart-bubble-graph-years').offset().top)) {
            curYears.addClass('visible');
            curYears.css({'width': curBlock.find('.opendata-chart-bubble-graph').width(), 'left': curBlock.find('.opendata-chart-bubble-graph').offset().left});
        } else {
            curYears.removeClass('visible');
        }
    });

    var headerHeight = 60;

    $('.opendata-table').each(function(e) {
        var windowScroll = $(window).scrollTop();
        var curTable = $(this);
        if ((windowScroll + headerHeight >= curTable.find('th').eq(0).offset().top) && (windowScroll + headerHeight < curTable.offset().top + curTable.outerHeight())) {
            curTable.find('.opendata-table-header-fixed').addClass('visible');
        } else {
            curTable.find('.opendata-table-header-fixed').removeClass('visible');
        }
    });
});


function createChartOrgMain(blockID, data) {
    var curBlock = $('[data-id="' + blockID + '"]');
    if (curBlock.length == 1) {
        makeChartOrgMain(curBlock, data);
    }
}

function makeChartOrgMain(curBlock, data) {
    var newHTML = '';

    function angle_point(a, b, c) {
        var x1 = a[0] - b[0];
        var x2 = c[0] - b[0];
        var y1 = a[1] - b[1];
        var y2 = c[1] - b[1];

        var d1 = Math.sqrt(x1 * x1 + y1 * y1);
        var d2 = Math.sqrt(x2 * x2 + y2 * y2);
        return Math.acos((x1 * x2 + y1 * y2) / (d1 * d2)) * 180 / Math.PI;
    }
    curBlock.html('');

    newHTML +=  '<div class="opendata-chart-org-main-content">' +
                    '<div class="opendata-chart-org-main-graph">' +
                        '<div class="opendata-chart-org-main-graph-scale-left-title">' + data.scaleLeftTitle + '</div>' +
                        '<div class="opendata-chart-org-main-graph-scale-left"></div>' +
                        '<div class="opendata-chart-org-main-graph-wrapper">' +
                            '<div class="opendata-chart-org-main-graph-container">' +
                            '</div>' +
                            '<div class="opendata-chart-org-main-graph-scale-x"></div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="opendata-chart-org-main-legend">';
    for (var i = 0; i < data.legend.length; i++) {
        newHTML +=  '<div class="opendata-chart-org-main-legend-item ' + data.legend[i].type + '">' +
                        data.legend[i].title +
                        '<div class="opendata-chart-org-main-legend-item-color" style="background-color:' + data.legend[i].color + '"></div>' +
                    '</div>';
    }
    newHTML +=      '</div>' +
                '</div>';
    curBlock.append(newHTML);

    var curScaleX = curBlock.find('.opendata-chart-org-main-graph-scale-x');

    for (var i = 0; i < data.data.length; i++) {
        var itemHTML =  '<div class="opendata-chart-org-main-graph-scale-x-item">' +
                            '<div class="opendata-chart-org-main-graph-item-year">' + data.data[i].year + '</div>';
        itemHTML +=     '</div>';
        curScaleX.append(itemHTML);
    }

    var itemHeight = 70;

    var curScaleLeft = curBlock.find('.opendata-chart-org-main-graph-scale-left');

    var curMaxLeft = 0;
    for (var i = 0; i < data.data.length; i++) {
        for (var j = 0; j < data.data[i].values.length; j++) {
            if (curMaxLeft < Number(data.data[i].values[j])) {
                curMaxLeft = Number(data.data[i].values[j]);
            }
        }
    }

    var countLeftLines = Math.ceil(curMaxLeft / Number(data.scaleLeftStep));
    for (var i = 0; i <= countLeftLines; i++) {
        curScaleLeft.append('<div class="opendata-chart-org-main-graph-scale-left-item" style="bottom:' + (i / countLeftLines * 100) + '%">' + numberWithSpaces(i * Number(data.scaleLeftStep)) + '</div>');
    }
    curMaxLeft = countLeftLines * Number(data.scaleLeftStep);

    curScaleLeft.css({'height': countLeftLines * itemHeight + 'px'});

    var curGraph = curBlock.find('.opendata-chart-org-main-graph-container');
    for (var i = 0; i < countLeftLines; i++) {
        curGraph.append('<div class="opendata-chart-org-main-graph-item"></div>');
    }

    var itemWidth = 110;
    if ($(window).width() < 1120) {
        itemWidth = 65;
    }
    curGraph.css({'width': data.data.length * itemWidth + 'px'});

    for (var i = 0; i < data.data.length; i++) {
        var itemHTML = '';
        var itemBarHTML = '';
        for (var j = 0; j < data.data[i].values.length; j++) {
            if (data.legend[j].type == 'left') {
                itemBarHTML += '<div class="opendata-chart-org-main-graph-item-bar-item" style="transform:translateX(' + (j * 10) + 'px); background-color:' + data.legend[j].color + '; height:' + (Number(data.data[i].values[j]) / curMaxLeft * 100) + '%"><span>' + data.data[i].values[j] + '</span></div>';
            }
        }
        itemHTML += '<div class="opendata-chart-org-main-graph-item-bar" style="left:' + (itemWidth * i) + 'px" data-year="' + i + '">' + itemBarHTML + '</div>';
        curGraph.append(itemHTML);
    }

    for (var i = 0; i < data.legend.length; i++) {
        var lineDots = [];
        for (var j = 0; j < data.data.length; j++) {
            if (data.legend[i].type == 'right') {
                if (data.data[j].values[i] !== null) {
                    lineDots.push({'year': j, 'value': Number(data.data[j].values[i])});
                }
            }
        }

        for (var j = 0; j < lineDots.length; j++) {
            var curX = lineDots[j].year * itemWidth + itemWidth / 2 + 8;
            var curY = curScaleLeft.height() - (curScaleLeft.height() * (lineDots[j].value / curMaxLeft)) + 10;
            if (j > 0) {
                var prevX = lineDots[j - 1].year * itemWidth + itemWidth / 2 + 8;
                var prevY = curScaleLeft.height() - curScaleLeft.height() * (lineDots[j - 1].value / curMaxLeft) + 10;
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                curGraph.append('<div class="opendata-chart-org-main-graph-item-point-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg); border-top-color:' + data.legend[i].color + '"></div>');
            }
        }
    }

    for (var i = 0; i < data.data.length; i++) {
        for (var j = 0; j < data.data[i].values.length; j++) {
            if (data.legend[j].type == 'right') {
                if (data.data[i].values[j] !== null) {
                    curGraph.append('<div class="opendata-chart-org-main-graph-item-point" style="left:' + (itemWidth * i) + 'px; bottom:' + (Number(data.data[i].values[j]) / curMaxLeft * 100) + '%; color:' + data.legend[j].color + '" border-color:' + data.legend[j].color + '" data-year="' + i + '"><span>' + data.data[i].values[j] + '</span></div>');
                }
            }
        }
    }

    curBlock.find('.opendata-chart-org-main-graph-wrapper').each(function() {
        $(this).mCustomScrollbar({
            axis: 'x',
            scrollButtons: {
                enable: true
            }
        });
    });

    curBlock.find('.opendata-chart-org-main-graph-item-point, .opendata-chart-org-main-graph-item-bar').on('mouseenter', function(e) {
        if ($(window).width() > 1119) {
            var curYear = Number($(this).attr('data-year'));
            $('.opendata-chart-org-main-hint').remove();
            var hintHTML =  '<div class="opendata-chart-org-main-hint">' +
                                '<div class="opendata-chart-org-main-hint-container">' +
                                    '<div class="opendata-chart-org-main-hint-title">' + data.data[curYear].year + ' г</div>' +
                                    '<div class="opendata-chart-org-main-hint-values">';
            for (var i = 0; i < data.legend.length; i++) {
                hintHTML +=     '<div class="opendata-chart-org-main-hint-value">' +
                                    '<div class="opendata-chart-org-main-hint-value-color"><div class="opendata-chart-org-main-hint-value-color-inner ' + data.legend[i].type + '" style="background-color:' + data.legend[i].color + '"></div></div>' +
                                    '<div class="opendata-chart-org-main-hint-value-title">' + data.legend[i].title + '</div>' +
                                    '<div class="opendata-chart-org-main-hint-value-text">' + numberWithSpaces(data.data[curYear].values[i]) + '</div>' +
                                '</div>';
            }
            hintHTML +=             '</div>' +
                                '</div>' +
                            '</div>';
            $('body').append(hintHTML);
            var curLeft = $(this).offset().left + $(this).width() / 2;
            var curTop = $(this).offset().top + $(this).height() / 2;
            $('.opendata-chart-org-main-hint').css({'left': curLeft, 'top': curTop});
            if ($('.opendata-chart-org-main-hint').offset().left + $('.opendata-chart-org-main-hint').outerWidth() > $(window).width()) {
                $('.opendata-chart-org-main-hint').addClass('right');
            }
        }
    });

    curBlock.find('.opendata-chart-org-main-graph-item-point, .opendata-chart-org-main-graph-item-bar').on('click', function(e) {
        if ($(window).width() < 1120) {
            var curYear = Number($(this).attr('data-year'));
            $('.opendata-chart-org-main-hint').remove();
            var hintHTML =  '<div class="opendata-chart-org-main-hint">' +
                                '<div class="opendata-chart-org-main-hint-bg"></div>' +
                                '<div class="opendata-chart-org-main-hint-container">' +
                                    '<div class="opendata-chart-org-main-hint-title">' + data.data[curYear].year + ' г</div>' +
                                    '<div class="opendata-chart-org-main-hint-values">';
            for (var i = 0; i < data.legend.length; i++) {
                hintHTML +=     '<div class="opendata-chart-org-main-hint-value">' +
                                    '<div class="opendata-chart-org-main-hint-value-color"><div class="opendata-chart-org-main-hint-value-color-inner ' + data.legend[i].type + '" style="background-color:' + data.legend[i].color + '"></div></div>' +
                                    '<div class="opendata-chart-org-main-hint-value-title">' + data.legend[i].title + '</div>' +
                                    '<div class="opendata-chart-org-main-hint-value-text">' + numberWithSpaces(data.data[curYear].values[i]) + '</div>' +
                                '</div>';
            }
            hintHTML +=             '</div>' +
                                    '<a href="#" class="opendata-chart-org-main-hint-close"></a>' +
                                '</div>' +
                            '</div>';
            $('body').append(hintHTML);
        }
    });

    curBlock.find('.opendata-chart-org-main-graph-item-point, .opendata-chart-org-main-graph-item-bar').on('mouseleave', function(e) {
        if ($(window).width() > 1119) {
            $('.opendata-chart-org-main-hint').remove();
        }
    });
}

function createChartFundsMain(blockID, data) {
    var curBlock = $('[data-id="' + blockID + '"]');
    if (curBlock.length == 1) {
        makeChartFundsMain(curBlock, data);
    }
}

function makeChartFundsMain(curBlock, data) {
    var newHTML = '';

    curBlock.html('');

    newHTML +=  '<div class="opendata-chart-funds-main-content">' +
                    '<div class="opendata-chart-funds-main-graph">' +
                        '<div class="opendata-chart-funds-main-graph-container">' +
                        '</div>' +
                    '</div>' +
                    '<div class="opendata-chart-funds-main-legend">';
    for (var i = 0; i < data.legend.length; i++) {
        newHTML +=  '<div class="opendata-chart-funds-main-legend-item">' +
                        data.legend[i].title +
                        '<div class="opendata-chart-funds-main-legend-item-color" style="background-color:' + data.legend[i].color + '"></div>' +
                    '</div>';
    }
    newHTML +=      '</div>' +
                '</div>';
    curBlock.append(newHTML);

    var curMax = 0;
    for (var i = 0; i < data.data.length; i++) {
        for (var j = 0; j < data.data[i].values.length; j++) {
            if (curMax < Number(data.data[i].values[j])) {
                curMax = Number(data.data[i].values[j]);
            }
        }
    }

    var curGraph = curBlock.find('.opendata-chart-funds-main-graph-container');

    for (var i = 0; i < data.data.length; i++) {
        var itemHTML = '';
        var itemBarHTML = '';
        for (var j = 0; j < data.data[i].values.length; j++) {
            itemBarHTML += '<div class="opendata-chart-funds-main-graph-item-bar-item" style="background-color:' + data.legend[j].color + '; width:' + (Number(data.data[i].values[j]) / curMax * 100) + '%"><span>' + data.data[i].values[j] + '</span></div>';
        }
        itemHTML += '<div class="opendata-chart-funds-main-graph-item">' +
                        '<div class="opendata-chart-funds-main-graph-item-title">' + data.data[i].title + '</div>' +
                        '<div class="opendata-chart-funds-main-graph-item-bars">' + itemBarHTML + '</div>' +
                    '</div>';
        curGraph.append(itemHTML);
    }
}

function createTable(curBlock, tableData, maxRows, sortDefaultCol, sortDefaultDir) {
    var newHTML = '';

    newHTML +=  '<div class="opendata-table">' +
                    '<div class="table-scroll">' +
                        '<table>' +
                            '<thead>' +
                                '<tr>';
    for (var i = 0; i < tableData.headers.length; i++) {
        var classBig = '';
        if (tableData.headers[i].size == 'big') {
            classBig = ' big';
        }
        newHTML +=                  '<th class="' + classBig + '">';
        if (tableData.headers[i].sort == true) {
            var classNumber = '';
            if (tableData.headers[i].type == 'number') {
                classNumber = ' sort-number';
            }
            newHTML +=                  '<a href="#" class="sort' + classNumber + '">';
        }
        newHTML +=                          tableData.headers[i].text;
        if (tableData.headers[i].sort == true) {
            newHTML +=                  '</a>';
        }
        newHTML +=                  '</th>';
    }

    newHTML +=                  '</tr>' +
                            '</thead>' +
                            '<tbody>';

    var countRows = tableData.rows.length;
    var isMoreRows = false;
    if (typeof maxRows !== 'undefined' && countRows > maxRows) {
        countRows = maxRows;
        isMoreRows = true;
    }
    for (var i = 0; i < countRows; i++) {
        newHTML +=              '<tr>' +
                                    '<td><strong>' + tableData.rows[i][0] + '</strong></td>';
        for (var j = 1; j < tableData.rows[i].length; j++) {
            newHTML +=              '<td><em>' + tableData.headers[j].text + '</em>' + tableData.rows[i][j] + '</td>';
        }
        newHTML +=              '</tr>';
    }

    newHTML +=              '</tbody>' +
                        '</table>' +
                    '</div>' +
                '</div>';

    if (isMoreRows) {
        newHTML += '<div class="opendata-table-more"><a href="#" class="btn"><span>Загрузить остальные</span><span>Свернуть</span></a></div>';
    }
    curBlock.html(newHTML);

    curBlock.find('.opendata-table-more .btn').click(function(e) {
        var curMore = $(this).parent();
        if (curMore.hasClass('open')) {
            curBlock.find('.opendata-table .table-scroll-fixed tbody tr:gt(' + (countRows - 1) + ')').remove();
            curBlock.find('.opendata-table .table-scroll tbody tr:gt(' + (countRows - 1) + ')').remove();
            curBlock.find('.opendata-table-more').removeClass('open');
        } else {
            curBlock.find('.opendata-table-more').addClass('loading');
            window.setTimeout(function() {
                var rowHTML = '';
                for (var i = countRows; i < tableData.rows.length; i++) {
                    rowHTML +=              '<tr>' +
                                                '<td><strong>' + tableData.rows[i][0] + '</strong></td>';
                    for (var j = 1; j < tableData.rows[i].length; j++) {
                        rowHTML +=              '<td><em>' + tableData.headers[j].text + '</em>' + tableData.rows[i][j] + '</td>';
                    }
                    rowHTML +=              '</tr>';
                }
                curBlock.find('.opendata-table .table-scroll tbody').append(rowHTML);
                if ($(window).width() > 1119) {
                    var curTable = curBlock.find('.opendata-table .table-scroll table');
                    var fixedTable = curBlock.find('.opendata-table .table-scroll-fixed table');
                    var htmlFixed = '';
                    curTable.find('tbody tr').each(function() {
                        htmlFixed +=            '<tr>' +
                                                    '<td>' + $(this).find('td').eq(0).html() + '</td>' +
                                                '</tr>';
                    });
                    fixedTable.find('tbody').html(htmlFixed);

                    var fixedCol = curBlock.find('.table-scroll-fixed');
                    fixedCol.find('th').width(curTable.find('th').eq(0).width()).height(curTable.find('th').eq(0).height());
                    fixedCol.find('td').each(function() {
                        var curTD = $(this);
                        var curIndex = fixedCol.find('td').index(curTD);
                        curTD.height(curTable.find('tbody tr').eq(curIndex).find('td').eq(0).height());
                    });
                }
                curBlock.find('.opendata-table-more').addClass('open');
                curBlock.find('.opendata-table-more').removeClass('loading');
            }, 100);

        }
        $(window).trigger('resize');
        e.preventDefault();
    });

    if ($(window).width() > 1119) {
        curBlock.find('.opendata-table').append('<div class="opendata-table-header-fixed"><div class="opendata-table-header-fixed-inner"></div></div>');
        curBlock.find('.opendata-table thead th').each(function() {
            curBlock.find('.opendata-table-header-fixed-inner').append('<div class="opendata-table-header-fixed-item" style="width:' + $(this).outerWidth() + 'px">' + $(this).find('a').html() + '</div>');
        });

        var curTable = curBlock.find('table');
        var htmlFixed = '<div class="table-scroll-fixed">' +
                            '<table>' +
                                '<thead>' +
                                    '<tr>' +
                                        '<th>' + curTable.find('th').eq(0).html() + '</th>' +
                                    '</tr>' +
                                '</thead>' +
                                '<tbody>';
        curTable.find('tbody tr').each(function() {
            htmlFixed +=            '<tr>' +
                                        '<td>' + $(this).find('td').eq(0).html() + '</td>' +
                                    '</tr>';
        });
        htmlFixed +=            '</tbody>' +
                            '</table>' +
                        '</div>';
        curBlock.find('.opendata-table').append(htmlFixed)

        var fixedCol = curBlock.find('.table-scroll-fixed');
        fixedCol.find('th').width(curTable.find('th').eq(0).width()).height(curTable.find('th').eq(0).height());
        fixedCol.find('td').each(function() {
            var curTD = $(this);
            var curIndex = fixedCol.find('td').index(curTD);
            curTD.height(curTable.find('tbody tr').eq(curIndex).find('td').eq(0).height());
        });
    }

    if ($(window).width() > 1119) {
        curBlock.find('.table-scroll').each(function() {
            $(this).mCustomScrollbar({
                axis: 'x',
                scrollInertia: 300,
                scrollButtons: {
                    enable: true
                },
                callbacks: {
                    onInit: function() {
                        curBlock.find('.table-scroll-fixed').removeClass('visible');
                    },

                    whileScrolling: function() {
                        if (-this.mcs.left == 0) {
                            curBlock.find('.table-scroll-fixed').removeClass('visible');
                        } else {
                            curBlock.find('.table-scroll-fixed').addClass('visible');
                        }
                        curBlock.find('.opendata-table-header-fixed-inner').css({'left': this.mcs.left});
                    }
                }
            });
        });
    }

    $(window).trigger('resize');

    if (typeof sortDefaultCol !== 'undefined') {
        var curLink = curBlock.find('th .sort').eq(sortDefaultCol);
        var curCol = curLink.parent();
        var curTable = curCol.parents().filter('table');
        var curColIndex = curTable.find('thead th').index(curCol);
        curTable.find('thead th a').removeClass('active up');
        curLink.addClass('active');
        if (sortDefaultDir == 'up') {
            curLink.addClass('active').addClass('up');
        }

        var curRows = [];
        curTable.find('tbody tr').each(function() {
            curRows.push($(this));
        });
        if (curLink.hasClass('sort-number')) {
            curRows.sort(function(a, b) {
                var aValue = Number(a.find('td').eq(curColIndex).html().replace(/\<em\>.+\<\/em\>/g, '').replace(/\ |&nbsp;|—/g, ''));
                if (aValue == NaN) {
                    aValue = 0;
                }
                var bValue = Number(b.find('td').eq(curColIndex).html().replace(/\<em\>.+\<\/em\>/g, '').replace(/\ |&nbsp;|—/g, ''));
                if (bValue == NaN) {
                    bValue = 0;
                }
                if (aValue < bValue) return -1;
                if (aValue > bValue) return 1;
                return 0;
            });
        } else {
            curRows.sort(function(a, b) {
                var aValue = a.find('td').eq(curColIndex).html();
                var bValue = b.find('td').eq(curColIndex).html();
                if (aValue < bValue) return -1;
                if (aValue > bValue) return 1;
                return 0;
            });
        }

        if (curLink.hasClass('up')) {
            curRows.reverse();
        }

        var newHTML = '';
        for (var i = 0; i < curRows.length; i++) {
            newHTML += '<tr>' + curRows[i].html() + '</tr>';
        }
        curTable.find('tbody').html(newHTML);


        curBlock.find('.table-scroll-fixed tbody').html('');
        var htmlFixed = '';
        curTable.find('tbody tr').each(function() {
            htmlFixed +=            '<tr>' +
                                        '<td>' + $(this).find('td').eq(0).html() + '</td>' +
                                    '</tr>';
        });
        curBlock.find('.table-scroll-fixed tbody').html(htmlFixed)

        var fixedCol = curBlock.find('.table-scroll-fixed');
        fixedCol.find('th').width(curTable.find('th').eq(0).width()).height(curTable.find('th').eq(0).height());
        fixedCol.find('td').each(function() {
            var curTD = $(this);
            var curIndex = fixedCol.find('td').index(curTD);
            curTD.height(curTable.find('tbody tr').eq(curIndex).find('td').eq(0).height());
        });
    }
}

$(document).ready(function() {

    $('.cookies-message-close').click(function(e) {
        $('.cookies-message').fadeOut(500);
        e.preventDefault();
    });

});