/**
 * Created by fsj on 2017/2/27.
 */
import {CDN_BASE} from '../const/uri';

export const cdnImg = (imgSrc) => {
  if(!imgSrc || imgSrc == undefined || imgSrc.length == 0) {
    return CDN_BASE + '/static/img/logo.png';
  }

  if(imgSrc.indexOf('http://') == 0 || imgSrc.indexOf('https://') == 0 || imgSrc.indexOf('ftp://') == 0) {
    return imgSrc;
  }

  if(imgSrc.indexOf('/') != 0) {
    imgSrc = '/' + imgSrc;
  }

  return CDN_BASE + imgSrc;
};
