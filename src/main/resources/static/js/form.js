/**
 * Created by ZhangYE on 2016/4/21.
 * 表单元素组合初始化
 */
$m = {};
$m.Select = function(){
    //页面中的Select遍历初始化
    var selCreate = function(obj){
        if(!obj){
            obj = $('body');
        }
        obj.find('select').each(function(){
            $(this).next('.m-select').remove();
            var _selStyle = $(this).attr('class'),
                _selWidth = $(this).css('width');
            var _selTitle = $(this).find("option:selected").text();
            var _selTitleHTML = '<div class="sel-title">' +
                '<span>'+_selTitle+'</span>' +
                '<i></i>' +
                '</div>';
            if(_selStyle==null){
                _selStyle = '';
            }
            var _selListHTML = '';
            $(this).children().each(function(){
                var _tagType = $(this).get(0).tagName;//标签类型(option/optgroup)
                //option类型转为普通li
                if(_tagType == 'OPTION'){
                    var _SelTrue = '';
                    var _OptName = $(this).text(),//选项名
                        _OptVal = $(this).val();//选项值
                    if($(this).prop('selected')==true){
                        _SelTrue = 'active';
                    }
                    _selListHTML += '<li data-index="'+_OptVal+'" class="'+_SelTrue+'">'+_OptName+'</li>';
                }
                if(_tagType == 'OPTGROUP'){
                    var _GroupName = $(this).attr('label');//组名
                    _selListHTML += '<li class="sel-group">'+_GroupName+'</li>';
                }
            });
            _selListHTML = '<div class="sel-list"><ul>'+_selListHTML+'</ul></div>';
            var selHTML = '<div class="m-select '+_selStyle+'" style="width: '+_selWidth+';">' +_selTitleHTML + _selListHTML + '</div>';
            $(this).after(selHTML);
            $(this).attr('style','position:absolute;z-index:-1;clip: rect(0px, 0px, 0px, 0px);');
        });
    };
    //Select点击选中
    var selClick = function(){
        $('body').on('click','.sel-list>ul>li:not(.sel-group)',function(){
            $(this).addClass('active').siblings('li').removeClass('active');
            var _selDom = $(this).parents('.m-select'),
                _selText = $(this).text(),
                _selVal = $(this).attr('data-index');
            _selDom.find('.sel-title span').text(_selText);
            _selDom.prev('select').val(_selVal).trigger('click').trigger('change');
        });
    };
    //原生Select赋值后组件同时更新
    var selUpdate = function(){
        $('body').on('change','select',function(){
            var _selDom = $(this).next('.m-select');
            if(_selDom.length>0){
                var _optVal = $(this).val(),
                    _optText = $(this).find("option:selected").text();
                _selDom.find('.sel-list>ul>li').each(function(){
                    var _selVal = $(this).attr('data-index'),
                        _selText = $(this).text();
                    if((_optVal == _selVal)&&(_optText == _selText)){
                        $(this).addClass('active').siblings('li').removeClass('active');
                        _selDom.find('.sel-title span').text(_selText);
                        _selDom.removeClass('active');
                    }
                });
            }
        });
    };
    //Select显示隐藏
    var selToggle = function(){
        $(document).click(function(e){
            var _clkDom = $(e.target);
            //点击发生在Select内
            if((_clkDom.hasClass('m-select'))||(_clkDom.parents('.m-select').length>0)){
                var _bSlide = _clkDom.parents('.m-select').hasClass('active');
                $('.m-select').removeClass('active');
                //点击Select标题
                if((_clkDom.hasClass('sel-title'))||(_clkDom.parents('.sel-title').length>0)){
                    if(!_bSlide){
                        _clkDom.parents('.m-select').addClass('active');
                    }
                }
                //点击组别
                else if(_clkDom.hasClass('sel-group')){
                    _clkDom.parents('.m-select').addClass('active');
                }
            }
            else{
                $('.m-select').removeClass('active');
            }
        });
    };
    return {
        init: function(obj) {
            selCreate(obj);
            selClick();
            selUpdate();
            selToggle();
        },
        create : function(obj){
            selCreate(obj);
        }
    }
}();

$m.Switch = function(){
    //页面中的Checkbox遍历初始化
    var switchCreate = function(obj){
        if(!obj){
            obj = $('body');
        }
        obj.find('input[type="checkbox"].switch').each(function(){
            $(this).siblings('i').remove();
            var _labelDom = $(this).parent('label');//以父级的label进行DOM操作
            var _iDom = '<i></i>';//模拟开关元素
            _labelDom.addClass('m-switch');
            if($(this).prop('checked')==true){
                _labelDom.addClass('active');
            }
            $(this).after(_iDom);
        });
    };
    var switchToggle = function(){
        $('body').on('change','input[type="checkbox"].switch',function(){
            var _labelDom = $(this).parent('.m-switch');
            if(_labelDom.length>0){
                if($(this).prop('checked')==true){
                    _labelDom.addClass('active');
                }
                else{
                    _labelDom.removeClass('active');
                }
            }
        });
    };
    return {
        init: function(obj) {
            switchCreate(obj);
            switchToggle();
        },
        create : function(obj){
            switchCreate(obj);
        }
    }
}();

$m.Radio = function(){
    //页面中的Radio遍历初始化
    var radioCreate = function(obj){
        if(!obj){
            obj = $('body');
        }
        obj.find('input[type="radio"]').each(function(){
            $(this).siblings('i').remove();
            var _labelDom = $(this).parent('label');//以父级的label进行DOM操作
            var _iDom = '<i></i>';//模拟单选框
            _labelDom.addClass('m-radio');
            if($(this).prop('checked')==true){
                _labelDom.addClass('active');
            }
            if($(this).attr('disabled')=='disabled'){
                _labelDom.addClass('disabled');
            }
            $(this).after(_iDom);
        });
    };
    //Radio点击选中
    var radioToggle = function(){
        $('body').on('change','input[type="radio"]',function(){
            var _radioGroup = $(this).attr('name');
            $('input[name="'+_radioGroup+'"]').each(function(){
                var _labelDom = $(this).parent('.m-radio');
                if(_labelDom.length>0){
                    if($(this).prop('checked')==true){
                        _labelDom.addClass('active');
                    }
                    else{
                        _labelDom.removeClass('active');
                    }
                }
            });
        });
    };
    return {
        init: function(obj) {
            radioCreate(obj);
            radioToggle();
        },
        create: function(obj){
            radioCreate(obj);
        }
    }
}();

$m.Checkbox = function(){
    //页面中的Checkbox遍历初始化
    var checkboxCreate = function(obj){
        if(!obj){
            obj = $('body');
        }
        obj.find('input[type="checkbox"]').not('.switch').each(function(){
            $(this).siblings('i').remove();
            var _labelDom = $(this).parent('label');//以父级的label进行DOM操作
            var _iDom = '<i></i>';//模拟复选框
            _labelDom.addClass('m-checkbox');
            if($(this).prop('checked')==true){
                _labelDom.addClass('active');
            }
            if($(this).attr('disabled')=='disabled'){
                _labelDom.addClass('disabled');
            }
            $(this).after(_iDom);
        });
    };
    //Checkbox点击选中/取消选中
    var checkboxToggle = function(){
        $('body').on('change','input[type="checkbox"]:not(.switch)',function(){
            var _labelDom = $(this).parent('.m-checkbox');
            if(_labelDom.length>0){
                if($(this).prop('checked')==true){
                    _labelDom.addClass('active');
                }
                else{
                    _labelDom.removeClass('active');
                }
            }
        });
    };
    return {
        init: function(obj) {
            checkboxCreate(obj);
            checkboxToggle();
        },
        create: function(obj){
            checkboxCreate(obj);
        }
    }
}();
$m.InputNum = function(){
    //页面中的input-num遍历初始化
    var numCreate = function(obj){
        if(!obj){
            obj = $('body');
        }
        obj.find('.m-input.input-num').each(function(){
            $(this).keyup(function(){
                $(this).trigger('change');
            });
            $(this).change(function(){
                var valArr = $(this).val().replace(/[^\d\.-]/g,'').replace(/^\./g,'').replace(/\.{2,}/g,'.').replace('.','$#$').replace(/\./g,'').replace('$#$','.').split(''),
                    tempVal = '';
                $.each(valArr,function(n,value) {
                    if((value == '-')&&(n!=0)){
                    }
                    else{
                        tempVal += value;
                    }
                });
                $(this).val(tempVal);
            });
        });
    };
    return {
        init: function(obj) {
            numCreate(obj);
        },
        create : function(obj){
            numCreate(obj);
        }
    }
}();

$m.Form = function(){
    //表单元素初始化
    var FormCreate = function(obj){
        $m.Checkbox.create(obj);
        $m.Select.create(obj);
        $m.Switch.create(obj);
        $m.Radio.create(obj);
        $m.InputNum.create(obj);
    };
    var FormInit = function(obj){
        $m.Checkbox.init(obj);
        $m.Select.init(obj);
        $m.Switch.init(obj);
        $m.Radio.init(obj);
        $m.InputNum.init(obj);
    };
    //表单重置事件
    var FormReset = function(){
        //表单重置事件
        $('[type="reset"]').click(function(){
            var _FormDom = $(this).parents('form');
            if(_FormDom.length>0){
                _FormDom[0].reset();
                _FormDom.find('select').trigger('change');
                _FormDom.find('input[type="radio"]').trigger('change');
                _FormDom.find('input[type="checkbox"]').trigger('change');
            }
        });
    };
    return {
        init: function(obj) {
            FormInit(obj);
            FormReset();
        },
        create : function(obj){
            FormCreate(obj);
        }
    }
}();