(function() {
    'use strict';

    function SortableDragAndDropMediaGridDirective($filter, mediaHelper) {

        function link(scope, el, attr, ctrl) {

            var itemDefaultHeight = 200;
            var itemDefaultWidth = 200;
            var itemMaxWidth = 200;
            var itemMaxHeight = 200;
            var itemMinWidth = 125;
            var itemMinHeight = 125;

            function activate() {

                if (scope.itemMaxWidth) {
                    itemMaxWidth = scope.itemMaxWidth;
                }

                if (scope.itemMaxHeight) {
                    itemMaxHeight = scope.itemMaxHeight;
                }

                if (scope.itemMinWidth) {
                    itemMinWidth = scope.itemMinWidth;
                }

                if (scope.itemMinWidth) {
                    itemMinHeight = scope.itemMinHeight;
                }

                for (var i = 0; scope.items.length > i; i++) {
                    var item = scope.items[i];
                    setItemData(item);
                    setOriginalSize(item, itemMaxHeight);

                    // remove non images when onlyImages is set to true
                    if(scope.onlyImages === "true" && !item.isFolder && !item.thumbnail){
                        scope.items.splice(i, 1);
                        i--;
                    }

                }

                if (scope.items.length > 0) {
                    setFlexValues(scope.items);
                }

            }

            function setItemData(item) {
                item.isFolder = !mediaHelper.hasFilePropertyType(item);
                if (!item.isFolder) {
                    item.thumbnail = mediaHelper.resolveFile(item, true);
                    item.image = mediaHelper.resolveFile(item, false);

                    var fileProp = _.find(item.properties, function (v) {
                        return (v.alias === "umbracoFile");
                    });

                    if (fileProp && fileProp.value) {
                        item.file = fileProp.value;
                    }

                    var extensionProp = _.find(item.properties, function (v) {
                        return (v.alias === "umbracoExtension");
                    });

                    if (extensionProp && extensionProp.value) {
                        item.extension = extensionProp.value;
                    }
                }
            }

            function setOriginalSize(item, maxHeight) {

                //set to a square by default
                item.width = itemDefaultWidth;
                item.height = itemDefaultHeight;
                item.aspectRatio = 1;

                var widthProp = _.find(item.properties, function(v) {
                    return (v.alias === "umbracoWidth");
                });

                if (widthProp && widthProp.value) {
                    item.width = parseInt(widthProp.value, 10);
                    if (isNaN(item.width)) {
                        item.width = itemDefaultWidth;
                    }
                }

                var heightProp = _.find(item.properties, function(v) {
                    return (v.alias === "umbracoHeight");
                });

                if (heightProp && heightProp.value) {
                    item.height = parseInt(heightProp.value, 10);
                    if (isNaN(item.height)) {
                        item.height = itemDefaultWidth;
                    }
                }

                item.aspectRatio = item.width / item.height;

                // set max width and height
                // landscape
                if (item.aspectRatio >= 1) {
                    if (item.width > itemMaxWidth) {
                        item.width = itemMaxWidth;
                        item.height = itemMaxWidth / item.aspectRatio;
                    }
                    // portrait
                } else {
                    if (item.height > itemMaxHeight) {
                        item.height = itemMaxHeight;
                        item.width = itemMaxHeight * item.aspectRatio;
                    }
                }

            }

            function setFlexValues(mediaItems) {

                var flexSortArray = mediaItems;
                var smallestImageWidth = null;
                var widestImageAspectRatio = null;

                // sort array after image width with the widest image first
                flexSortArray = $filter('orderBy')(flexSortArray, 'width', true);

                // find widest image aspect ratio
                widestImageAspectRatio = flexSortArray[0].aspectRatio;

                // find smallest image width
                smallestImageWidth = flexSortArray[flexSortArray.length - 1].width;

                for (var i = 0; flexSortArray.length > i; i++) {

                    var mediaItem = flexSortArray[i];
                    var flex = 1 / (widestImageAspectRatio / mediaItem.aspectRatio);

                    if (flex === 0) {
                        flex = 1;
                    }

                    var imageMinFlexWidth = smallestImageWidth * flex;

                    var flexStyle = {
                        "flex": flex + " 1 " + imageMinFlexWidth + "px",
                        "max-width": mediaItem.width + "px",
                        "min-width": itemMinWidth + "px",
                        "min-height": itemMinHeight + "px"
                    };

                    mediaItem.flexStyle = flexStyle;

                }

            }

            scope.clickItem = function(item, $event, $index) {
                if (scope.onClick) {
                    scope.onClick(item, $event, $index);
                }
            };

            scope.clickItemName = function(item, $event, $index) {
                if (scope.onClickName) {
                    scope.onClickName(item, $event, $index);
                    $event.stopPropagation();
                }
            };

            scope.hoverItemDetails = function(item, $event, hover) {
                if (scope.onDetailsHover) {
                    scope.onDetailsHover(item, $event, hover);
                }
            };

            scope.allowDrop = function(e) {
                e.preventDefault();
            };

            scope.drag = function(ev, el) {
                var data = {
                    id: el.getAttribute('data-id'),
                    sortOrder: el.getAttribute('data-sort')
                };
                ev.dataTransfer.setData('text/plain', JSON.stringify(data));
            };

            scope.drop = function(ev, el) {
                ev.preventDefault();
                var droppedData = JSON.parse(ev.dataTransfer.getData('text/plain'));
                var targetData = {
                    id: el.getAttribute('data-id'),
                    sortOrder: el.getAttribute('data-sort')
                }
                if (scope.onSwap) {
                    scope.onSwap(droppedData, targetData);
                }
            };

            var unbindItemsWatcher = scope.$watch('items', function(newValue, oldValue) {
                if (angular.isArray(newValue)) {
                    activate();
                }
            });

            scope.$on('$destroy', function() {
                unbindItemsWatcher();
            });

        }

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/SortableDragAndDropMedia/views/sortableDragAndDropMediaGrid.html',
            scope: {
                items: '=',
                onDetailsHover: "=",
                onClick: '=',
                onClickName: "=",
                onSwap: "=",
                filterBy: "=",
                itemMaxWidth: "@",
                itemMaxHeight: "@",
                itemMinWidth: "@",
                itemMinHeight: "@",
                onlyImages: "@"
            },
            link: link
        };

        return directive;
    }

    angular.module('umbraco.directives').directive('sortableDragAndDropMediaGrid', SortableDragAndDropMediaGridDirective);

})();
(function() {
    "use strict";
    function SortableDragAndDropMediaController ($scope, $routeParams, mediaHelper, mediaResource, $location, listViewHelper, mediaTypeHelper) {

        var vm = this; 

        vm.nodeId = $scope.contentId;
        //we pass in a blacklist by adding ! to the file extensions, allowing everything EXCEPT for disallowedUploadFiles
        vm.acceptedFileTypes = !mediaHelper.formatFileTypes(Umbraco.Sys.ServerVariables.umbracoSettings.disallowedUploadFiles);
        vm.maxFileSize = Umbraco.Sys.ServerVariables.umbracoSettings.maxFileSize + "KB";
        vm.activeDrag = false;
        vm.mediaDetailsTooltip = {};
        vm.itemsWithoutFolders = [];
        vm.isRecycleBin = $scope.contentId === '-21' || $scope.contentId === '-20';
        vm.acceptedMediatypes = [];

        vm.dragEnter = dragEnter;
        vm.dragLeave = dragLeave;
        vm.onFilesQueue = onFilesQueue;
        vm.onUploadComplete = onUploadComplete;

        vm.hoverMediaItemDetails = hoverMediaItemDetails;
        vm.selectContentItem = selectContentItem;
        vm.selectItem = selectItem;
        vm.selectFolder = selectFolder;
        vm.swapItems = swapItems;
        vm.goToItem = goToItem;

        function activate() {
            vm.itemsWithoutFolders = filterOutFolders($scope.items);
            vm.itemsWithoutFolders = sortItemsBySortOrder(vm.itemsWithoutFolders);
            //no need to make another REST/DB call if this data is not used when we are browsing the bin
            if ($scope.entityType === 'media' && !vm.isRecycleBin) {
                mediaTypeHelper.getAllowedImagetypes(vm.nodeId).then(function (types) {
                    vm.acceptedMediatypes = types;
                });
            }

        }

        function filterOutFolders(items) {

            var newArray = [];

            if(items && items.length ) {

                for (var i = 0; items.length > i; i++) {
                    var item = items[i];
                    var isFolder = !mediaHelper.hasFilePropertyType(item);

                    if (!isFolder) {
                        newArray.push(item);
                    }
                }

            }

            return newArray;
        }

        function swapItems(a, b) {
            var nodeIds = [];
            var parentId = $scope.items[0].parentId;
            var indexForA = -1;
            var indexForB = -1;
            var items = sortItemsBySortOrder($scope.items)
            for (var i = 0; i < items.length; i++) {
                nodeIds.push(items[i].id);
                if (items[i].id == a.id) {
                    indexForA = i;
                } else if (items[i].id == b.id) {
                    indexForB = i;
                }
            }
            if (indexForA > -1 && indexForB > -1) {
                var tempItem = items[indexForB];
                items[indexForB] = items[indexForA];
                var tempASortOrder = items[indexForA].sortOrder;
                items[indexForB].sortOrder = tempItem.sortOrder;
                items[indexForA] = tempItem;
                items[indexForA].sortOrder = tempASortOrder;
                nodeIds[indexForA] = Number(b.id);
                nodeIds[indexForB] = Number(a.id);
                vm.itemsWithoutFolders = filterOutFolders(items);
                mediaResource.sort({parentId: parentId, sortedIds: nodeIds}).then(function() {
                });
            }
        };

        function sortItemsBySortOrder(items) {
            items.sort(function(a, b) {
                // Compare the 2 dates
                if(a.sortOrder < b.sortOrder) return -1;
                if(a.sortOrder > b.sortOrder) return 1;
                return 0;
            });
            return items;
        };

        function dragEnter(el, event) {
            vm.activeDrag = true;
        }

        function dragLeave(el, event) {
            vm.activeDrag = false;
        }

        function onFilesQueue() {
            vm.activeDrag = false;
        }

        function onUploadComplete() {
            $scope.getContent($scope.contentId);
        }

        function hoverMediaItemDetails(item, event, hover) {

            if (hover && !vm.mediaDetailsTooltip.show) {

            vm.mediaDetailsTooltip.event = event;
            vm.mediaDetailsTooltip.item = item;
            vm.mediaDetailsTooltip.show = true;

            } else if (!hover && vm.mediaDetailsTooltip.show) {

            vm.mediaDetailsTooltip.show = false;

            }

        }

        function selectContentItem(item, $event, $index) {
            listViewHelper.selectHandler(item, $index, $scope.items, $scope.selection, $event);
        }

        function selectItem(item, $event, $index) {
            listViewHelper.selectHandler(item, $index, vm.itemsWithoutFolders, $scope.selection, $event);
        }

        function selectFolder(folder, $event, $index) {
            listViewHelper.selectHandler(folder, $index, $scope.folders, $scope.selection, $event);
        }

        function goToItem(item, $event, $index) {
            $location.path($scope.entityType + '/' + $scope.entityType + '/edit/' + item.id);
        }

        activate();

    };
    angular.module("umbraco").controller("sortableDragAndDropMedia.controller", SortableDragAndDropMediaController);
})();