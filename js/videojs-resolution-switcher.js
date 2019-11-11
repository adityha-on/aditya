/* videojs-resolution-switcher - 2015-7-26*/
(function(){
    var a=null;
    if(typeof window.videojs==="undefined"&&typeof require==="function"){
        a=require("video.js")
    }else{
        a=window.videojs
    }
    (function(i,g){
        var h,b={ui:true};
        var d=g.getComponent("MenuItem");
        var f=g.extend(d,{constructor:function(k,j){
            j.selectable=true;
            d.call(this,k,j);
            this.src=j.src;
            k.on("resolutionchange",g.bind(this,this.update))
        }});
        f.prototype.handleClick=function(j){
            d.prototype.handleClick.call(this,j);
            this.player_.currentResolution(this.options_.label)
        };
        f.prototype.update=function(){
            var j=this.player_.currentResolution();
            this.selected(this.options_.label===j.label)
        };
        d.registerComponent("ResolutionMenuItem",f);
        var c=g.getComponent("MenuButton");
        var e=g.extend(c,{constructor:function(k,j){
            this.label=document.createElement("span");
            j.label="Quality";
            c.call(this,k,j);
            this.el().setAttribute("aria-label","Quality");
            this.controlText("Quality");
            if(j.dynamicLabel){
                g.dom.addClass(this.label,"vjs-resolution-button-label");
                this.el().appendChild(this.label)
            }else{
                var l=document.createElement("span");
                g.dom.addClass(l,"vjs-menu-icon");
                this.el().appendChild(l)
            }
            k.on("updateSources",g.bind(this,this.update))
        }});
        e.prototype.createItems=function(){
            var l=[];
            var k=(this.sources&&this.sources.label)||{};
            for(var j in k){
                if(k.hasOwnProperty(j)){
                    l.push(new f(this.player_,{label:j,src:k[j],selected:j===(this.currentSelection?this.currentSelection.label:false)}))
                }
            }
            return l
        };
        e.prototype.update=function(){
            this.sources=this.player_.getGroupedSrc();
            this.currentSelection=this.player_.currentResolution();
            this.label.innerHTML=this.currentSelection?this.currentSelection.label:"";
            return c.prototype.update.call(this)
        };
        e.prototype.buildCSSClass=function(){
            return c.prototype.buildCSSClass.call(this)+" vjs-resolution-button"
        };
        c.registerComponent("ResolutionMenuButton",e);
        h=function(s){
            var u=g.mergeOptions(b,s),t=this,p={},o={},n={};
            t.updateSrc=function(w){
                if(!w){return t.src()}w=w.filter(function(y){
                    try{return(t.canPlayType(y.type)!=="")}catch(x){return true}
                });
                this.currentSources=w.sort(m);
                this.groupedSrc=k(this.currentSources);
                var v=l(this.groupedSrc,this.currentSources);
                this.currentResolutionState={label:v.label,sources:v.sources};
                t.trigger("updateSources");
                t.setSourcesSanitized(v.sources,v.label);
                t.trigger("resolutionchange");return t
            };
            t.currentResolution=function(z,w){
                if(z==null){return this.currentResolutionState}
                if(!this.groupedSrc||!this.groupedSrc.label||!this.groupedSrc.label[z]){
                    return}var A=this.groupedSrc.label[z];
                    var v=t.currentTime();
                    var y=t.paused();
                    if(!y&&this.player_.options_.bigPlayButton){this.player_.bigPlayButton.hide()}
                    var x="loadeddata";
                    if(this.player_.techName_!=="Youtube"&&this.player_.preload()==="none"&&this.player_.techName_!=="Flash"){
                        x="timeupdate"
                    }
                    t.setSourcesSanitized(A,z,w||u.customSourcePicker).one(x,function(){
                        t.currentTime(v);
                        t.handleTechSeeked_();
                        if(!y){t.play()}
                        t.trigger("resolutionchange")
                    });return t
                };
                t.getGroupedSrc=function(){return this.groupedSrc};
                t.setSourcesSanitized=function(x,w,v){
                    this.currentResolutionState={label:w,sources:x};
                    if(typeof v==="function"){return v(t,x,w)}
                    t.src(x.map(function(y){
                        return{src:y.src,type:y.type,res:y.res}
                    }));return t
                };
                function m(v,w){if(!v.res||!w.res){return 0}return(+w.res)-(+v.res)}function k(w){
                    var v={label:{},res:{},type:{}};
                    w.map(function(x){
                        r(v,"label",x);
                        r(v,"res",x);
                        r(v,"type",x);
                        j(v,"label",x);
                        j(v,"res",x);
                        j(v,"type",x)
                    });return v
                }
                function r(w,v,x){
                    if(w[v][x[v]]==null){w[v][x[v]]=[]}
                }
                function j(w,v,x){w[v][x[v]].push(x)}function l(v,y){
                    var x=u["default"];
                    var w="";
                    if(x==="high"){x=y[0].res;w=y[0].label
                    }else{
                        if(x==="low"||x==null||!v.res[x]){
                            x=y[y.length-1].res;
                            w=y[y.length-1].label
                        }else{
                            if(v.res[x]){w=v.res[x][0].label}
                        }
                    }return{res:x,label:w,sources:v.res[x]}
                }
                function q(x){
                    var w={highres:{res:1080,label:"1080",yt:"highres"},
                    hd1080:{res:1080,label:"1080",yt:"hd1080"},
                    hd720:{res:720,label:"720",yt:"hd720"},
                    large:{res:480,label:"480",yt:"large"},
                    medium:{res:360,label:"360",yt:"medium"},
                    small:{res:240,label:"240",yt:"small"},
                    tiny:{res:144,label:"144",yt:"tiny"},
                    auto:{res:0,label:"auto",yt:"auto"}};
                    var v=function(z,A,y){
                        x.tech_.ytPlayer.setPlaybackQuality(A[0]._yt);
                        x.trigger("updateSources");
                        return x
                    };
                    u.customSourcePicker=v;
                    x.tech_.ytPlayer.setPlaybackQuality("auto");
                    x.tech_.ytPlayer.addEventListener("onPlaybackQualityChange",function(y){
                        for(var z in w){
                            if(z.yt===y.data){
                                x.currentResolution(z.label,v);return
                            }
                        }
                    });
                    x.one("play",function(){
                        var A=x.tech_.ytPlayer.getAvailableQualityLevels();
                        var y=[];
                        A.map(function(B){
                            y.push({src:x.src().src,type:x.src().type,label:w[B].label,res:w[B].res,_yt:w[B].yt})
                        });
                        x.groupedSrc=k(y);
                        var z={label:"auto",res:0,sources:x.groupedSrc.label.auto};
                        this.currentResolutionState={label:z.label,sources:z.sources};
                        x.trigger("updateSources");
                        x.setSourcesSanitized(z.sources,z.label,v)
                    })
                }
                t.ready(function(){
                    if(u.ui){var v=new e(t,u);
                        t.controlBar.resolutionSwitcher=t.controlBar.el_.insertBefore(v.el_,t.controlBar.getChild("fullscreenToggle").el_);
                        t.controlBar.resolutionSwitcher.dispose=function(){this.parentNode.removeChild(this)}
                    }if(t.options_.sources.length>1){
                        t.updateSrc(t.options_.sources)
                    }if(t.techName_==="Youtube"){q(t)}})
        };
        g.registerPlugin("videoJsResolutionSwitcher",h)
    })
        (window,a)
})();
