$(function () {
	game.startScreen.draw();
})


var game = {
	
	stage : $("#box"),
	
	modetxt : "",
	
	timer : {
		bg : null,
		bullet : null,
		enemy : null
	},
	mode : [
		[7,2500,500,1000,4000,200],
		[5,2000,300,3000,6000,300],
		[3,1500,50,4000,8000,400]
	], //参数配置
	num : {
		count : 0,
		warcraftX : 0,
		warcraftY : 0,
		score : 0
	},
	stitle : function ( score ) {
		switch ( game.modetxt ) {
			case '纯屌丝模式' : 
				if( score == 0 ) {
					return '屌丝中的屌丝';
				}
				else if( score <= 20000 ) {
					return '入门级屌丝'
				}
				else if( score <= 100000 && score > 20000 ) {
					return '资深屌丝'
				}
				else if( score <= 500000 && score > 100000 ) {
					return '知名屌丝'
				}
				else {
					return '全国十佳屌丝';
				}
			case '高富帅模式' : 
				if( score == 0 ) {
					return '药不能停';
				}
				else if( score <= 20000 ) {
					return '人艰不拆'
				}
				else if( score <= 100000 && score > 20000 ) {
					return '夜用型高富帅'
				}
				else if( score <= 500000 && score > 100000 ) {
					return '日夜两用'
				}
				else {
					return '打飞机战将';
				}
			case '李少侠模式' : 
				if( score == 0 ) {
					return '坑爹坑娘';
				}
				else if( score <= 20000 ) {
					return '我很无辜'
				}
				else if( score <= 100000 && score > 20000 ) {
					return '小伙伴惊呆了'
				}
				else if( score <= 500000 && score > 100000 ) {
					return '我是受害者'
				}
				else {
					return '嫖客';
				}
		}
	},
	startScreen : {
		draw : function () {
			var title = $("<div>");
				title.addClass("title");
				title.html("打飞机 1.0 Javascript版");
				game.stage.append(title);
			
			var difficulty = $("<div>");
				difficulty.addClass("difficulty");
				difficulty.html("<a href='javascript:void(0)'>纯屌丝模式</a><a href='javascript:void(0)'>高富帅模式</a><a href='javascript:void(0)'>李少侠模式</a>");
				game.stage.append(difficulty);
			game.stage.find($(".difficulty")).delegate("a","click", function ( e ) {
				game.stage.start = true ;
				game.startScreen.remove();
				$(document).mousemove( function ( e ) {
					if( game.num.count % 2 == 0 && game.stage.start)
					{
						var e = e || event;
						var x = e.clientX - game.stage.offset().left - 10;
						var y = e.clientY - game.stage.offset().top - 10;
						game.core.warcraft([x,y]);
					}
					game.num.count++;
				})
				var set = game.mode[$(this).index()];
				game.modetxt = $(this).html();
				game.core.draw(set[0]);
				game.timer.bullet = setInterval ( function () {
					game.core.bullet(set[1],[game.num.warcraftX,game.num.warcraftY]);
				},set[2]);
				game.timer.enemy =setInterval ( function () {
					game.core.enemy({
						speed : game.randomNum(set[3],set[4]),
						left : game.randomNum(0,277),
						top : -game.randomNum(30,80)
					});
				},set[5])
			
			});
		}, //绘制开始界面
		remove : function () {
			var removeDiv = game.stage.children($("div"));
			removeDiv.stop().animate({opacity:0},100);
			setTimeout( function () {
				removeDiv.remove();
			},300)
		}
	}, //开始场景
	core : {
		draw : function ( speed ) {
			var warcraft = $("<div>");
				warcraft.addClass("warcraft");
			game.stage.append(warcraft);
			var score = $("<div>");
				score.addClass("score");
				score.html("0");
			game.stage.append(score);
		}, //绘制游戏场景
		warcraft : function ( pos ) { 
			var warcraft = game.stage.find($(".warcraft")),
				left =  pos[0] -warcraft.width()/2 - 3,
				top =  pos[1] - warcraft.height()/2 - 6;
			
			if( left <= -warcraft.width()/2 ) {
				left = -warcraft.width()/2;
			}
			else if( left >= game.stage.width() - warcraft.width()/2) {
				left = game.stage.width() - warcraft.width()/2;
			}
			if( top <= 0) {
				top = 0;
			}
			else if ( top >= game.stage.height() - warcraft.height()) {
				top = game.stage.height() - warcraft.height();
			}
			warcraft.css({left:left,top:top});
			game.num.warcraftX = left + warcraft.width()/2;
			game.num.warcraftY = top + warcraft.height()/2;
		}, //战斗机位置
		bullet : function ( speed ,pos ) {
			var bullet = $("<div>");
				bullet.addClass("bullet");
			game.stage.append(bullet);
			bullet.css({
					left : pos[0] - bullet.width()/2,
					top : pos[1] - bullet.height()/2
				});
			bullet.stop().animate({top:-bullet.height()},speed,function () { bullet.remove();})
		}, //子弹开始发射
		enemy : function ( argument ) {
			var speed = argument.speed;
			var left = argument.left;
			var top = argument.top;
			var oEnemy  = $("<div>");
				oEnemy.addClass("enemy");
				oEnemy.css({
					left : left,
					top : top
				});
			oEnemy.appendTo(game.stage);
			oEnemy.stop().animate( { top:530 }, speed , function () { oEnemy.remove(); clearInterval(oEnemy.timer)});
			oEnemy.timer = setInterval ( function () {
				var x = parseInt(oEnemy.css("left")) + 12,
					y = parseInt(oEnemy.css("top")) + 15,
					l = $(".bullet").length;
				for( var i = 0 ; i< l; i++ )
				{
					var bx = Math.abs( x - parseInt($(".bullet").eq(i).css("left"))),
						by = Math.abs( y - parseInt($(".bullet").eq(i).css("top")));
					if( bx <= 14 &&  by <= 20 )
					{
						oEnemy.css("background","url('img/boom.png')");
						$(".bullet").eq(i).remove();
						clearInterval(oEnemy.timer);
						game.num.score++;
						game.stage.find($(".score")).html(game.num.score*1000);
						setTimeout( function () { oEnemy.remove(); },300)
					}
				}
				var bx2 = Math.abs( x - parseInt($(".warcraft").css("left")) - 30),
					by2 = Math.abs( y - parseInt($(".warcraft").css("top")) - 18);
				if( bx2 <= 40 &&  by2 <= 33 )
				{
					var tips = $("<div>");
						tips.addClass("tips");
						tips.html("您在<span class='type'>" + game.modetxt.substring(0,3) + "杯</span>全国花式打飞机大赛上，以<span class='nn'>"+$(".score").html() + "</span>分荣获称谓<span class='tt'>"+game.stitle($(".score").html())+"</span><p>再打一次</p>");
						game.stage.delegate(".tips p",'click',function(){
							game.num.score = 0;
							game.startScreen.remove();
							game.startScreen.draw();
						})
					oEnemy.remove();
					$(".score").css("display","none");
					$(".warcraft").css("background","url('img/boom2.png')");
					clearInterval(oEnemy.timer);
					setTimeout( function () { $(".warcraft").remove(); },300)
					clearInterval(game.timer.bullet);
					clearInterval(game.timer.enemy);
					clearInterval(game.timer.bg);
					setTimeout( function () {
						game.stage.append(tips);
					},3000)
					
				}
			},50)
		} //敌机

	}, //核心代码
	randomNum : function (a,b){
		var value = Math.abs(a-b) , num ;
		num = parseInt(Math.random()*(value)) + Math.min(a,b);
		return num;
	} //产生指定区域整形随机数。
};