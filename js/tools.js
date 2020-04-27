$(document).ready(function() {

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

});

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