/* ========================================================================
 * Bootstrap: modal.js v3.3.0
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // MODAL CLASS DEFINITION
    // ======================

    var Modal = function (element, options) {
        this.options        = options
        this.$body          = $(document.body)
        this.$element       = $(element)
        this.$backdrop      =
            this.isShown        = null
        this.scrollbarWidth = 0

        if (this.options.remote) {
            this.$element
                .find('.modal-content')
                .load(this.options.remote, $.proxy(function () {
                    this.$element.trigger('loaded.bs.modal')
                }, this))
        }
    }

    Modal.VERSION  = '3.3.0'

    Modal.TRANSITION_DURATION = 300
    Modal.BACKDROP_TRANSITION_DURATION = 150

    Modal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    }

    Modal.prototype.toggle = function (_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget)
    }

    Modal.prototype.show = function (_relatedTarget) {
        var that = this
        var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.checkScrollbar()
        this.$body.addClass('modal-open')

        this.setScrollbar()
        this.escape()

        this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(that.$body) // don't move modals dom position
            }

            that.$element
                .show()
                .scrollTop(0)

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
                .addClass('in')
                .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
                that.$element.find('.modal-dialog') // wait for modal to slide in
                    .one('bsTransitionEnd', function () {
                        that.$element.trigger('focus').trigger(e)
                    })
                    .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
                that.$element.trigger('focus').trigger(e)
        })
    }

    Modal.prototype.hide = function (e) {
        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
            .removeClass('in')
            .attr('aria-hidden', true)
            .off('click.dismiss.bs.modal')

        $.support.transition && this.$element.hasClass('fade') ?
            this.$element
                .one('bsTransitionEnd', $.proxy(this.hideModal, this))
                .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
            this.hideModal()
    }

    Modal.prototype.enforceFocus = function () {
        $(document)
            .off('focusin.bs.modal') // guard against infinite focus loop
            .on('focusin.bs.modal', $.proxy(function (e) {
                if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                    this.$element.trigger('focus')
                }
            }, this))
    }

    Modal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keydown.dismiss.bs.modal')
        }
    }

    Modal.prototype.hideModal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.$body.removeClass('modal-open')
            that.resetScrollbar()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Modal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Modal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
                .prependTo(this.$element)
                .on('click.dismiss.bs.modal', $.proxy(function (e) {
                    if (e.target !== e.currentTarget) return
                    this.options.backdrop == 'static'
                        ? this.$element[0].focus.call(this.$element[0])
                        : this.hide.call(this)
                }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
                this.$backdrop
                    .one('bsTransitionEnd', callback)
                    .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            var callbackRemove = function () {
                that.removeBackdrop()
                callback && callback()
            }
            $.support.transition && this.$element.hasClass('fade') ?
                this.$backdrop
                    .one('bsTransitionEnd', callbackRemove)
                    .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callbackRemove()

        } else if (callback) {
            callback()
        }
    }

    Modal.prototype.checkScrollbar = function () {
        this.scrollbarWidth = this.measureScrollbar()
    }

    Modal.prototype.setScrollbar = function () {
        var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
        if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
    }

    Modal.prototype.resetScrollbar = function () {
        this.$body.css('padding-right', '')
    }

    Modal.prototype.measureScrollbar = function () { // thx walsh
        if (document.body.clientWidth >= window.innerWidth) return 0
        var scrollDiv = document.createElement('div')
        scrollDiv.className = 'modal-scrollbar-measure'
        this.$body.append(scrollDiv)
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
        this.$body[0].removeChild(scrollDiv)
        return scrollbarWidth
    }


    // MODAL PLUGIN DEFINITION
    // =======================

    function Plugin(option, _relatedTarget) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.modal')
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    var old = $.fn.modal

    $.fn.modal             = Plugin
    $.fn.modal.Constructor = Modal


    // MODAL NO CONFLICT
    // =================

    $.fn.modal.noConflict = function () {
        $.fn.modal = old
        return this
    }


    // MODAL DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
        var $this   = $(this)
        var href    = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
        var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        if ($this.is('a')) e.preventDefault()

        $target.one('show.bs.modal', function (showEvent) {
            if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
            $target.one('hidden.bs.modal', function () {
                $this.is(':visible') && $this.trigger('focus')
            })
        })
        Plugin.call($target, option, this)
    })

}(jQuery);



/**
 * 弹出框插件，基于bootstrap
 * option = {
 * 	type String
 * 		弹出框类型。可选有 【dialog】一般弹出框、【alert】警告框、【confirm】确认对话框、【info】信息提示框、【loading】加载提示框。
 * 		其中信息提示框【info】和加载提示框【loading】均不会显示顶部和底部区域。默认值为"dialog"
 * 	title String
 * 		弹出框的标题文本。type为dialog|info|loading时默认值为空字符串""；type为alert默认值为"提示信息"；type为confirm默认值为"确认提示"
 * 	content String
 * 		弹出框的内容，可传入html字符串。默认值为空字符串""
 * 	width String|Number
 * 		弹出框宽度。可设置百分比字符串值、px/em单位字符串值、数字（px值）。其高度自适应。默认值为20%
 * 	left String|Number
 * 		弹出框距左侧的位置。可设置百分比字符串值、px/em单位字符串值、数字（px值）、字符串"auto"（水平居中）。默认为"auto"
 * 	top String|Number
 * 		弹出框距顶部的位置。可设置百分比字符串值、px/em单位字符串值、数字（px值）。默认值为13%
 * 	inAnime Boolean
 * 		弹出框弹出时是否显示动画效果（淡入淡出效果）。默认值为true
 * 	modal Boolean|Array
 * 		指定是否显示遮罩层和设置遮罩层的颜色、透明度。设为false则不显示遮罩层，设为true则显示默认的黑色半透明遮罩层。
 * 		若设为二维数组，一维为颜色值，二维为透明度，如['#000', 0.3]
 * 	buttons Array[Object]
 * 		设置底部区域的按钮。对【alert】、【confirm】、【info】、【loading】类型的弹出框无效。
 * 		Object = {
 * 			text String
 * 				按钮文本内容
 * 			btnStyle String|Object
 * 				设置按钮的class选择器名称或行内样式。设为string类型则添加class名称，设为object类型则添加行内样式
 * 			click String|function(ui) {}
 * 				按钮点击后的回调。string类型下只允许设置 yes 或 no，分别代表【确认】或【取消】；设为function类型时则作为按钮点击事件的回调，
 * 				如果回调函数明确返回布尔值true，则执行完回调后关闭弹出框，否则不关闭弹出框。支持jquery的promise机制。ui为当前弹出框的jquery对象
 * 		}
 * 	dialogClass String
 * 		弹出框的特殊class选择器名称。默认为空字符串""
 * 	headerStyle String|Object
 * 		弹出框顶部区域的class选择器名称或行内样式。设为string类型则为顶部区域添加class名称，设为object类型则添加行内样式。支持除宽度外的其他样式设置
 * 	bodyStyle String|Object
 * 		弹出框内容区域的class选择器名称或行内样式。设为string类型则为内容区域添加class名称，设为object类型则添加行内样式。支持除宽度外的其他样式设置
 * 	footerStyle String|Object
 * 		弹出框底部区域的class选择器名称或行内样式。设为string类型则为底部区域添加class名称，设为object类型则添加行内样式。支持除宽度外的其他样式设置
 * 	draggable Boolean
 * 		弹出框是否支持拖动。默认值为false
 * 	created function(event) { }
 * 		弹出框成功弹出后的回调函数
 * 	dragging function(event) { }
 * 		弹出框拖拽时的回调函数
 * 	dragStart function(event) { }
 * 		弹出框拖拽开始时的回调函数
 * 	dragStop function(event) { }
 * 		弹出框拖拽结束时的回调函数
 * 	beforeClose function(ui) { }
 * 		点击【确认】按钮时的回调函数。如果函数明确返回布尔值false，则不关闭弹出框，否则在正常关闭弹出框后执行closed回调函数。支持jquery的promise机制。ui为当前弹出框的jquery对象
 * 	closed function(event) { }
 * 		弹出框关闭后执行的回调函数
 * }
 */
var dialog = {
    poplayer: function(option) {
        //- 所有的弹出框类型
        var _types = ['dialog', 'alert', 'confirm', 'info', 'loading'];
        //- 默认配置项
        var _defaults = {
            type: "dialog",
            parent: $('body'),
            title: "",
            content: "",
            width: "20%",
            top: "13%",
            left: "auto",
            inAnime: true,
            modal: true,
            buttons: [
                {
                    text: '确定',
                    btnStyle: "btn-info",
                    click: 'yes'
                },
                {
                    text: '取消',
                    btnStyle: "btn-default",
                    click: 'no'
                }
            ],
            dialogClass: "",
            headerStyle: null,
            bodyStyle: null,
            footerStyle: null,
            created: null,
            draggable: false,
            dragging: null,
            dragStart: null,
            dragStop: null,
            beforeClose: null,
            closed: null
        };
        //-私有函数声明- 校验弹出框类型参数
        var _typeValid = function(type) {
            for(var i in _types) {
                if(_types[i] === type) {
                    return type;
                }
            }
            return _types[0];
        };
        //-私有函数声明- 获取对象的原始类型
        var otype = function(o) {
            if(jQuery && o instanceof jQuery) {
                return "jquery";
            }
            return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
        };
        //- 初始化配置项
        var config = $.extend({}, _defaults);
        if(otype(option) === "object") {
            $.extend(true, config, option);
            // 单独处理buttons配置项
            if(otype(option.buttons) !== "undefined") {
                config.buttons = option.buttons;
            }
        }
        config.type = _typeValid(config.type);
        if(!config.title) {
            switch(config.type) {
                case 'alert':
                    config.title = "提示信息";
                    break;
                case 'confirm':
                    config.title = "确认提示";
                    break;
                default:
                    break;
            }
        }
        // 处理宽度
        if(otype(config.width) === "number" || /^\d+$/.test(config.width)) {
            config.width += "px";
        } else if(otype(config.width) !== "string" || config.width === "auto") {
            config.width = _defaults.width;
        }
        // 处理距顶部的位置
        if(otype(config.top) === "number" || /^\d+$/.test(config.top)) {
            config.top += "px";
        } else if(otype(config.top) !== "string" || config.top === "auto") {
            config.top = _defaults.top;
        }
        // 处理距左侧的位置
        if(otype(config.left) === "number" || /^\d+$/.test(config.left)) {
            config.left += "px";
        } else if(otype(config.left) !== "string") {
            config.left = _defaults.left;
        }
        // 处理弹出时是否显示动画
        var _animeClass = config.inAnime === false ? '' : ' fade';
        // 处理弹出框的位置
        var _margin = config.left === "auto" ? config.top + " auto" :  config.top + " " + config.left;
        // 处理头部区域样式
        if(config.headerStyle && config.headerStyle.width) {
            delete config.headerStyle.width;
        }
        // 处理内容区域样式
        if(config.bodyStyle && config.bodyStyle.width) {
            delete config.bodyStyle.width;
        }
        // 处理底部区域样式
        if(config.footerStyle && config.footerStyle.width) {
            delete config.footerStyle.width;
        }
        // 处理回调函数
        if(otype(config.dragging) !== "function") {
            config.dragging = _defaults.dragging;
        }
        if(otype(config.dragStart) !== "function") {
            config.dragStart = _defaults.dragStart;
        }
        if(otype(config.dragStop) !== "function") {
            config.dragStop = _defaults.dragStop;
        }
        if(otype(config.created) !== "function") {
            config.created = _defaults.created;
        }
        if(otype(config.beforeClose) !== "function") {
            config.beforeClose = _defaults.beforeClose;
        }
        if(otype(config.closed) !== "function") {
            config.closed = _defaults.closed;
        }
        // 初始化包裹层
        var wrapper = null;
        switch(config.type) {
            case "info":
                wrapper = $(
                    '<div class="modal dialog-'+config.type+ _animeClass +' bs-example-modal-sm" tabindex="-1" role="dialog" aria-hidden="true">' +
                    '<div class="modal-dialog modal-sm" style="margin:'+ _margin +';">' +
                    '<div class="modal-body">' +
                    '<div style="padding: .35em 0; text-align: center;">'+config.content+'</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                );
                break;
            case "loading":
                wrapper = $(
                    '<div class="modal dialog-'+config.type+ _animeClass +'" tabindex="-1" role="dialog" aria-hidden="true">' +
                    '<div class="modal-dialog modal-sm" style="display: table; width: auto; margin:'+ _margin +';">' +
                    config.content +
                    '</div>' +
                    '</div>'
                );
                break;
            default:
                wrapper = $(
                    '<div class="modal dialog-'+config.type+ _animeClass +'" tabindex="-1" role="dialog" aria-labelledby="DialogLabel" aria-hidden="true">'+
                    '<div class="modal-dialog" style="width: '+ config.width +'; margin:'+ _margin +';">'+
                    '<div class="modal-header">'+
                    '<button type="button" class="close btn-no" data-dismiss="modal">'+
                    '<span aria-hidden="true" style="font-size: 30px;">&times;</span>'+
                    '</button>'+
                    '<h4 id="DialogLabel" class="modal-title">'+ config.title +'</h4>'+
                    '</div>'+
                    '<div class="modal-body">'+ (otype(config.content) === "string" ? config.content : '') +'</div>'+
                    '</div>'+
                    '</div>'
                );
        }

        var dialogWrapper = wrapper.children(".modal-dialog:first");

        // 初始化按钮
        var $footer = null;
        switch(config.type) {
            case "alert":
                config.buttons = [];
                config.buttons.push(_defaults.buttons[0]);
                break;
            case "confirm":
                config.buttons = _defaults.buttons;
                break;
            default:
                break;
        }
        if(otype(config.buttons) === "array") {
            $footer = $('<div class="modal-footer"></div>');
            var btn = null;
            for(var i in config.buttons) {
                btn = config.buttons[i];
                if(otype(btn) !== "object") continue;
                var $btn = null;
                btn.text = btn.text || "按钮"+i;
                if(otype(btn.click) === "string") {
                    if(btn.click === "yes") {
                        $btn = $('<button type="button" class="m-btn btn-yes">'+ btn.text +'</button>');
                    } else if(btn.click === "no") {
                        $btn = $('<button type="button" class="m-btn btn-no" data-dismiss="modal">'+ btn.text +'</button>');
                    } else {
                        $btn = $('<button type="button" class="m-btn">'+ btn.text +'</button>');
                    }
                } else if(otype(btn.click) === "function") {
                    $btn = $('<button type="button" class="m-btn btn-callback-'+ i +'">'+ btn.text +'</button>');
                }
                if(otype(btn.btnStyle) === "string") {
                    $btn.addClass(btn.btnStyle);
                } else if(otype(btn.btnStyle) === "object") {
                    $btn.css(btn.btnStyle);
                }
                $btn && $footer.prepend($btn);
            }
        }
        // 将按钮添加至底部区域
        switch(config.type) {
            case "info":
            case "loading":
                break;
            default:
                otype($footer) === "jquery" && dialogWrapper.append($footer);
        }

        var dialogHeader = dialogWrapper.children(".modal-header:first"),
            dialogBody = dialogWrapper.children(".modal-body:first"),
            dialogFooter = dialogWrapper.children(".modal-footer:first");

        // 为弹出框添加class选择器名称
        if(config.dialogClass) {
            dialogWrapper.addClass(config.dialogClass);
        }
        // 处理jquery对象类型的内容
        var $content = null;
        if(otype(config.content) === "jquery") {
            $content = config.content.clone(true);
            $content.prevObject = config.content.prevObject;
            $content.nextObject = config.content.nextObject;
            dialogBody.append(config.content).children().show();
        }
        // 设置弹出框顶部、内容、底部区域的样式/class选择器名称
        if(dialogHeader.length>0 && config.headerStyle){
            if(otype(config.headerStyle) === "string") {
                dialogHeader.addClass(config.headerStyle);
            } else if(otype(config.headerStyle) === "object") {
                dialogHeader.css(config.headerStyle);
            }
        }

        if(dialogBody.length>0 && config.bodyStyle){
            if(otype(config.bodyStyle) === "string") {
                dialogBody.addClass(config.bodyStyle);
            } else if(otype(config.bodyStyle) === "object") {
                dialogBody.css(config.bodyStyle);
            }
        }


        if(dialogFooter.length>0 && config.footerStyle){
            if(otype(config.footerStyle) === "string") {
                dialogFooter.addClass(config.footerStyle);
            } else if(otype(config.footerStyle) === "object") {
                dialogFooter.css(config.footerStyle);
            }
        }
        // 初始化弹出框ID
        var timestamp = new Date().getTime(), id = "";
        progressID = timestamp;
        if(config.type != "dialog") {
            id = "dialog-"+config.type+"-"+timestamp;
        } else {
            id = "dialog-"+timestamp;
        }
        wrapper.attr('id', id);
        //弹出框父级不是body，则修改为绝对定位
        if(config.parent.get(0).tagName!='BODY'){
            $('body').addClass('modal-open-scroll');
            wrapper.addClass('dialog-absolute');
        }
        // 渲染弹出框
        config.parent.append(wrapper);
        dialog._id = id;
        var $dialog = $("#"+id);
        // 初始化拖动对话框方法
        var _onDrag = function(evt) {
            var modalDialogHeader = $dialog.find(".modal-header");
            var modalDialog = $dialog.find(".modal-dialog");
            var _moveflag = false; // 移动标记
            var _x = 0, _y = 0; // 鼠标离文档左上角的相对位置
            var _dx = 0, _dy = 0; // 对话框当前相对位移
            var _lx = 0, _ly = 0; // 鼠标距离对话框左上角的位置
            modalDialogHeader.mousedown(function(e) {
                var _evt = evt;
                _evt.type = "drapStart";
                $(this).css("cursor", "move");
                _moveflag = true;
                _x = e.pageX;
                _y = e.pageY;
                _lx = _x - modalDialog.offset().left;
                _ly = _y - modalDialog.offset().top;
                config.dragStart && config.dragStart(_evt);
            });
            $(document).mousemove(function(e) {
                var _evt = evt;
                _evt.type = "dragging";
                var _doMove = function(e) {
                    var x, y ;
                    if(e.pageX <= _lx) {
                        x = _lx;
                    } else if(e.pageX >= $dialog.width() - modalDialog.width() + _lx) {
                        x = $dialog.width() - modalDialog.width() + _lx;
                    } else x = e.pageX;
                    if(e.pageY <= _ly) {
                        y = _ly;
                    } else if(e.pageY >= $dialog.height() - modalDialog.height() + _ly) {
                        y = $dialog.height() - modalDialog.height() + _ly;
                    } else {
                        y = e.pageY;
                    }
                    var dx = x - _x + _dx;
                    var dy = y - _y + _dy;
                    modalDialog.css({"top": dy, "left": dx});
                };
                if(_moveflag) {
                    //dargging回调函数中如果返回false则不拖动
                    var flag = true;
                    if(config.dragging) {
                        flag = config.dragging(_evt);
                    }
                    if(otype(flag) === "object" && flag.done) {
                        flag.done(function(res) {
                            if(res !== false) {
                                _doMove(e);
                            }
                        });
                    } else if(flag !== false) {
                        _doMove(e);
                    }
                }
            }).mouseup(function(e) {
                var _evt = evt;
                _evt.type = "dragStop";
                modalDialogHeader.css("cursor", "auto");
                _moveflag = false;
                _dx = parseInt(modalDialog.css("left"));
                _dx = isNaN(_dx) ? 0 : _dx;
                _dy = parseInt(modalDialog.css("top"));
                _dy = isNaN(_dy) ? 0 : _dy;
                config.dragStop && config.dragStop(_evt);
            });
        };
        // 初始化事件回调
        $dialog.on("shown.bs.modal", function(e) {
            // 添加拖动效果
            config.draggable === true && _onDrag(e);
            // 初始化遮罩层的颜色和透明度
            if(otype(config.modal) === "array") {
                $dialog.siblings(".modal-backdrop").css({
                    'backgroundColor': config.modal[0],
                    'opacity': config.modal[1],
                    'filter': "alpha(opacity="+(config.modal[1]*100)+")"
                });
            }
            config.created && config.created(e);
        });
        $dialog.on("hidden.bs.modal", function(e) {
            // 关闭弹出框后
            if(e.target.closeType && e.target.closeType === "yes") {
                e.closeType = "yes";
            } else {
                e.closeType = "no";
            }
            config.closed && config.closed(e);
            if(otype($content) === "jquery") {
                if(otype($content.prevObject) === "jquery" && $content.prevObject.length) {
                    $content.prevObject.after($content);
                } else if(otype($content.nextObject) === "jquery" && $content.nextObject.length) {
                    $content.nextObject.before($content);
                } else {
                    $("body").append($content);
                }
            }
            /*if(config.type != "loading") {
             delete dialog._id;
             }*/
            $(e.target).remove();
        });
        $dialog.find(".btn-yes").on("click", function(e) {
            // 点击【确认】按钮
            var flag = true;
            if(config.beforeClose) {
                flag = config.beforeClose($dialog);
            }
            if(otype(flag) === "object" && flag.done) {
                flag.done(function(res) {
                    if(res !== false) {
                        $dialog[0].closeType = "yes";
                        $dialog.modal("hide");
                    }
                });
            } else if(flag !== false) {
                $dialog[0].closeType = "yes";
                $dialog.modal("hide");
            }
        });
        $dialog.find(".btn[class*='btn-callback']").on("click", function(e) {
            // 点击自定义按钮
            var flag = false, callback = null;
            var clazz = $(this).attr('class').match(/btn-callback-\d+/g);
            if(clazz !== null) {
                var index = Number(clazz[0].match(/\d+/g)[0]);
                if(!isNaN(index) && otype(config.buttons) === "array") {
                    callback = config.buttons[index].click;
                }
            }
            if(otype(callback) === "function") {
                flag = callback($dialog);
            }
            if(otype(flag) === "object" && flag.done) {
                flag.done(function(res) {
                    if(res === true) {
                        $dialog[0].closeType = "yes";
                        $dialog.modal("hide");
                    }
                });
            } else if(flag === true) {
                $dialog[0].closeType = "yes";
                $dialog.modal("hide");
            }
        });
        // 初始化遮罩层
        var _backdrop = "static";
        switch(config.type) {
            case 'alert':
            case 'confirm':
                _backdrop = "static";
                break;
            default:
                _backdrop = config.modal === false ? false : "static";
                break;
        }
        // 显示弹出框
        $dialog.modal({
            backdrop : _backdrop
        });
    },
    alert: function(title, content, callback,width) {
        if(arguments.length == 0) return;
        var _title = "提示信息", _content = "", _callback = null;
        if(arguments.length == 1) {
            if(typeof arguments[0] !== "string") return;
            _content = arguments[0];
        } else if(arguments.length == 2) {
            if(typeof arguments[0] !== "string") return;
            if(typeof arguments[1] == "string") {
                _title = arguments[0];
                _content = arguments[1];
            } else {
                _content = arguments[0];
                _callback = arguments[1];
            }
        } else if(arguments.length >= 3) {
            if(typeof arguments[0] === "string") {
                _title = arguments[0];
            }
            if(typeof arguments[1] === "string") {
                _content = arguments[1];
            }
            if(typeof arguments[2] === "function") {
                _callback = arguments[2];
            }
        }
        var _width= "20%";
        if(arguments.length == 4){
            _width = arguments[3];
        }
        dialog.poplayer({
            type: "alert",
            title: _title,
            width: _width,
            content: _content,
            closed: _callback
        });
    },
    confirm : function(title, content, callback,width) {
        if(arguments.length == 0) return;
        var _title = "确认提示", _content = "", _callback = null;
        if(arguments.length == 1) {
            if(typeof arguments[0] !== "string") return;
            _content = arguments[0];
        } else if(arguments.length == 2) {
            if(typeof arguments[0] !== "string") return;
            if(typeof arguments[1] == "string") {
                _title = arguments[0];
                _content = arguments[1];
            } else {
                _content = arguments[0];
                _callback = arguments[1];
            }
        } else if(arguments.length >= 3) {
            if(typeof arguments[0] === "string") {
                _title = arguments[0];
            }
            if(typeof arguments[1] === "string") {
                _content = arguments[1];
            }
            if(typeof arguments[2] === "function") {
                _callback = arguments[2];
            }
        }
        var _width= "20%";
        if(arguments.length == 4){
            _width = arguments[3];
        }
        dialog.poplayer({
            type: "confirm",
            title: _title,
            width: _width,
            content: _content,
            closed: function(e) {
                if(e.closeType === "yes") {
                    typeof _callback === "function" && _callback(e);
                }
            }
        });
    },
    progress : function(content, callback, timeout) {
        content = content || "";
        if(typeof callback !== "function") {
            timeout = callback;
            callback = null;
        }
        callback = callback || null;
        timeout = (typeof timeout === "number" && timeout > 0) ? timeout : 1500;
        dialog.poplayer({
            type: "info",
            content: content,
            modal: true,
            created: function(e) {

            },
            closed: callback
        });
    },
    info: function(content, callback, timeout,width) {
        content = content || "";
        if(typeof callback !== "function") {
            timeout = callback;
            callback = null;
        }
        callback = callback || null;
        timeout = (typeof timeout === "number" && timeout > 0) ? timeout : 1500;
        var _width= "20%";
        if(arguments.length == 4){
            _width = arguments[3];
        }
        dialog.poplayer({
            type: "info",
            content: content,
            width:_width,
            modal: true,
            created: function(e) {
                setTimeout(function() {
                    $(e.target).modal("hide");
                }, timeout);
            },
            closed: callback
        });
    },
    /**
     * 显示加载提示信息
     * options = {
	 * 	type Number|String
	 * 		加载图片的类型，在公共images目录下的loading目录下维护，格式为loading_[type].gif
	 * 	text String
	 * 		加载显示的文本内容，默认没有文本内容
	 * 	modal boolean|Array
	 * 		指定是否显示遮罩层和设置遮罩层的颜色、透明度，默认为false（不显示），设置为true则显示为白色（#000）透明度为0.5的遮罩层，
	 * 		可用二维数组设置，一维为颜色值，二维为透明度，如['#000', 0.3]
	 * }
     */
    loading: function(option) {
        var _defaults = {
            type: 0,
            text: "",
            modal: false,
            parent: $('.tmp-link')
        };
        var opt = {}, _modal = ['#fff', 0.5];
        var otype = function(o) {
            if(jQuery && o instanceof jQuery) {
                return "jquery";
            }
            return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
        };
        if(otype(option) === "string") {
            if(option === "remove") {
                $("#"+dialog._id).modal("hide");
                return;
            }
            $.extend(opt, _defaults, {text: option});
        } else if(otype(option) === "object") {
            if(option.modal) {
                if(otype(option.modal) === "array") {
                    if(otype(option.modal[0]) === "undefined") {
                        option.modal[0] = _modal[0];
                    }
                    if(otype(option.modal[1]) !== "number") {
                        option.modal[1] = parseFloat(option.modal[1]);
                    }
                    if(isNaN(option.modal[1]) || option.modal[1] < 0 || option.modal[1] > 1) {
                        option.modal[1] = _modal[1];
                    }
                } else {
                    option.modal = _modal;
                }
            }
            $.extend(true, opt, _defaults, option);
        } else {
            $.extend(opt, _defaults);
        }
        var _inAnime = true;
        var _content = '';

        var protocol = window.location.protocol + '//',
            host = window.location.host + '/',
            pathName = window.location.pathname.split('/');
        pathName.shift();
        var rootpath = protocol + host + pathName[0];
        if(opt.text) {
            _content =
                '<div class="modal-body">' +
                '<img src="/images/1.gif">'+
                _content+'<span style="margin-left: .5em;">'+opt.text+'</span>'+
                '</div>';
        } else {
            _inAnime = false;
        }
        dialog.poplayer({
            type: "loading",
            parent: opt.parent,
            inAnime: _inAnime,
            modal: opt.modal,
            bodyStyle: {
                'display': "table-cell",
                'padding': "15px 35px",
                'white-space': "nowrap",
                'vertical-align': "middle"
            },
            content: _content
        });
    }
};