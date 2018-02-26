/*! svg.pathmorphing.js - v0.1.1 - 2017-07-23
* Copyright (c) 2017 Ulrich-Matthias Schäfer; Licensed MIT */
(function(){function a(a,e,f,g,h,i,j){for(var k=a.slice(e,f||j),l=g.slice(h,i||j),m=0,n={pos:[0,0],start:[0,0]},o={pos:[0,0],start:[0,0]};;){if(k[m]=b.call(n,k[m]),l[m]=b.call(o,l[m]),k[m][0]!=l[m][0]||"M"==k[m][0]||"A"==k[m][0]&&(k[m][4]!=l[m][4]||k[m][5]!=l[m][5])?(Array.prototype.splice.apply(k,[m,1].concat(d.call(n,k[m]))),Array.prototype.splice.apply(l,[m,1].concat(d.call(o,l[m])))):(k[m]=c.call(n,k[m]),l[m]=c.call(o,l[m])),++m==k.length&&m==l.length)break;m==k.length&&k.push(["C",n.pos[0],n.pos[1],n.pos[0],n.pos[1],n.pos[0],n.pos[1]]),m==l.length&&l.push(["C",o.pos[0],o.pos[1],o.pos[0],o.pos[1],o.pos[0],o.pos[1]])}return{start:k,dest:l}}function b(a){switch(a[0]){case"z":case"Z":a[0]="L",a[1]=this.start[0],a[2]=this.start[1];break;case"H":a[0]="L",a[2]=this.pos[1];break;case"V":a[0]="L",a[2]=a[1],a[1]=this.pos[0];break;case"T":a[0]="Q",a[3]=a[1],a[4]=a[2],a[1]=this.reflection[1],a[2]=this.reflection[0];break;case"S":a[0]="C",a[6]=a[4],a[5]=a[3],a[4]=a[2],a[3]=a[1],a[2]=this.reflection[1],a[1]=this.reflection[0]}return a}function c(a){var b=a.length;return this.pos=[a[b-2],a[b-1]],-1!="SCQT".indexOf(a[0])&&(this.reflection=[2*this.pos[0]-a[b-4],2*this.pos[1]-a[b-3]]),a}function d(a){var b=[a];switch(a[0]){case"M":return this.pos=this.start=[a[1],a[2]],b;case"L":a[5]=a[3]=a[1],a[6]=a[4]=a[2],a[1]=this.pos[0],a[2]=this.pos[1];break;case"Q":a[6]=a[4],a[5]=a[3],a[4]=1*a[4]/3+2*a[2]/3,a[3]=1*a[3]/3+2*a[1]/3,a[2]=1*this.pos[1]/3+2*a[2]/3,a[1]=1*this.pos[0]/3+2*a[1]/3;break;case"A":b=f(this.pos,a),a=b[0]}return a[0]="C",this.pos=[a[5],a[6]],this.reflection=[2*a[5]-a[3],2*a[6]-a[4]],b}function e(a,b){if(b===!1)return!1;for(var c=b,d=a.length;d>c;++c)if("M"==a[c][0])return c;return!1}function f(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C=Math.abs(b[1]),D=Math.abs(b[2]),E=b[3]%360,F=b[4],G=b[5],H=b[6],I=b[7],J=new SVG.Point(a),K=new SVG.Point(H,I),L=[];if(0===C||0===D||J.x===K.x&&J.y===K.y)return[["C",J.x,J.y,K.x,K.y,K.x,K.y]];for(c=new SVG.Point((J.x-K.x)/2,(J.y-K.y)/2).transform((new SVG.Matrix).rotate(E)),d=c.x*c.x/(C*C)+c.y*c.y/(D*D),d>1&&(d=Math.sqrt(d),C=d*C,D=d*D),e=(new SVG.Matrix).rotate(E).scale(1/C,1/D).rotate(-E),J=J.transform(e),K=K.transform(e),f=[K.x-J.x,K.y-J.y],h=f[0]*f[0]+f[1]*f[1],g=Math.sqrt(h),f[0]/=g,f[1]/=g,i=4>h?Math.sqrt(1-h/4):0,F===G&&(i*=-1),j=new SVG.Point((K.x+J.x)/2+i*-f[1],(K.y+J.y)/2+i*f[0]),k=new SVG.Point(J.x-j.x,J.y-j.y),l=new SVG.Point(K.x-j.x,K.y-j.y),m=Math.acos(k.x/Math.sqrt(k.x*k.x+k.y*k.y)),k.y<0&&(m*=-1),n=Math.acos(l.x/Math.sqrt(l.x*l.x+l.y*l.y)),l.y<0&&(n*=-1),G&&m>n&&(n+=2*Math.PI),!G&&n>m&&(n-=2*Math.PI),p=Math.ceil(2*Math.abs(m-n)/Math.PI),r=[],s=m,o=(n-m)/p,q=4*Math.tan(o/4)/3,w=0;p>=w;w++)u=Math.cos(s),t=Math.sin(s),v=new SVG.Point(j.x+u,j.y+t),r[w]=[new SVG.Point(v.x+q*t,v.y-q*u),v,new SVG.Point(v.x-q*t,v.y+q*u)],s+=o;for(r[0][0]=r[0][1].clone(),r[r.length-1][2]=r[r.length-1][1].clone(),e=(new SVG.Matrix).rotate(E).scale(C,D).rotate(-E),w=0,x=r.length;x>w;w++)r[w][0]=r[w][0].transform(e),r[w][1]=r[w][1].transform(e),r[w][2]=r[w][2].transform(e);for(w=1,x=r.length;x>w;w++)v=r[w-1][2],y=v.x,z=v.y,v=r[w][0],A=v.x,B=v.y,v=r[w][1],H=v.x,I=v.y,L.push(["C",y,z,A,B,H,I]);return L}SVG.extend(SVG.PathArray,{morph:function(b){for(var c=this.value,d=this.parse(b),f=0,g=0;;){if(f===!1&&g===!1)break;if(startOffsetNextM=e(c,f===!1?!1:f+1),destOffsetNextM=e(d,g===!1?!1:g+1),f===!1){var h=new SVG.PathArray(i.start).bbox();f=0==h.height||0==h.width?c.push(c[0])-1:c.push(["M",h.x+h.width/2,h.y+h.height/2])-1}if(g===!1){var h=new SVG.PathArray(i.dest).bbox();g=0==h.height||0==h.width?d.push(d[0])-1:d.push(["M",h.x+h.width/2,h.y+h.height/2])-1}var i=a(c,f,startOffsetNextM,d,g,destOffsetNextM);c=c.slice(0,f).concat(i.start,startOffsetNextM===!1?[]:c.slice(startOffsetNextM)),d=d.slice(0,g).concat(i.dest,destOffsetNextM===!1?[]:d.slice(destOffsetNextM)),f=startOffsetNextM===!1?!1:f+i.start.length,g=destOffsetNextM===!1?!1:g+i.dest.length}return this.value=c,this.destination=new SVG.PathArray,this.destination.value=d,this}})}).call(this);
