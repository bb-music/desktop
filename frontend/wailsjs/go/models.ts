export namespace app {
	
	export class AppConfig {
	    video_proxy_port: number;
	    config_dir: string;
	
	    static createFrom(source: any = {}) {
	        return new AppConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.video_proxy_port = source["video_proxy_port"];
	        this.config_dir = source["config_dir"];
	    }
	}
	export class AuthParams {
	    sign_data: bb_client.SignData;
	    spi_data: bb_client.SpiData;
	
	    static createFrom(source: any = {}) {
	        return new AuthParams(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.sign_data = this.convertValues(source["sign_data"], bb_client.SignData);
	        this.spi_data = this.convertValues(source["spi_data"], bb_client.SpiData);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class DownloadMusicParams {
	    aid: string;
	    bvid: string;
	    cid: string;
	    name: string;
	    download_dir: string;
	
	    static createFrom(source: any = {}) {
	        return new DownloadMusicParams(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.aid = source["aid"];
	        this.bvid = source["bvid"];
	        this.cid = source["cid"];
	        this.name = source["name"];
	        this.download_dir = source["download_dir"];
	    }
	}
	export class MusicItem {
	    aid: number;
	    bvid: string;
	    cid: number;
	    name: string;
	    duration: number;
	    id: string;
	    origin: string;
	
	    static createFrom(source: any = {}) {
	        return new MusicItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.aid = source["aid"];
	        this.bvid = source["bvid"];
	        this.cid = source["cid"];
	        this.name = source["name"];
	        this.duration = source["duration"];
	        this.id = source["id"];
	        this.origin = source["origin"];
	    }
	}
	export class MusicOrderItem {
	    id: string;
	    name: string;
	    cover: string;
	    desc: string;
	    author: string;
	    musicList: MusicItem[];
	    created_at: string;
	    updated_at: string;
	
	    static createFrom(source: any = {}) {
	        return new MusicOrderItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.cover = source["cover"];
	        this.desc = source["desc"];
	        this.author = source["author"];
	        this.musicList = this.convertValues(source["musicList"], MusicItem);
	        this.created_at = source["created_at"];
	        this.updated_at = source["updated_at"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace bb_client {
	
	export class Argueinfo {
	    argue_msg: string;
	    argue_type: number;
	    argue_link: string;
	
	    static createFrom(source: any = {}) {
	        return new Argueinfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.argue_msg = source["argue_msg"];
	        this.argue_type = source["argue_type"];
	        this.argue_link = source["argue_link"];
	    }
	}
	export class Descv2 {
	    raw_text: string;
	    type: number;
	    biz_id: number;
	
	    static createFrom(source: any = {}) {
	        return new Descv2(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.raw_text = source["raw_text"];
	        this.type = source["type"];
	        this.biz_id = source["biz_id"];
	    }
	}
	export class Dimension {
	    width: number;
	    height: number;
	    rotate: number;
	
	    static createFrom(source: any = {}) {
	        return new Dimension(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.width = source["width"];
	        this.height = source["height"];
	        this.rotate = source["rotate"];
	    }
	}
	export class Durl {
	    order: number;
	    length: number;
	    size: number;
	    ahead: string;
	    vhead: string;
	    url: string;
	    backup_url: string[];
	
	    static createFrom(source: any = {}) {
	        return new Durl(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.order = source["order"];
	        this.length = source["length"];
	        this.size = source["size"];
	        this.ahead = source["ahead"];
	        this.vhead = source["vhead"];
	        this.url = source["url"];
	        this.backup_url = source["backup_url"];
	    }
	}
	export class GetVideoDetailParams {
	    aid: string;
	    bvid: string;
	
	    static createFrom(source: any = {}) {
	        return new GetVideoDetailParams(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.aid = source["aid"];
	        this.bvid = source["bvid"];
	    }
	}
	export class GetVideoUrlParams {
	    aid: string;
	    bvid: string;
	    cid: string;
	
	    static createFrom(source: any = {}) {
	        return new GetVideoUrlParams(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.aid = source["aid"];
	        this.bvid = source["bvid"];
	        this.cid = source["cid"];
	    }
	}
	export class Owner {
	    mid: number;
	    name: string;
	    face: string;
	
	    static createFrom(source: any = {}) {
	        return new Owner(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.mid = source["mid"];
	        this.name = source["name"];
	        this.face = source["face"];
	    }
	}
	export class Rights {
	    bp: number;
	    elec: number;
	    download: number;
	    movie: number;
	    pay: number;
	    hd5: number;
	    no_reprint: number;
	    autoplay: number;
	    ugc_pay: number;
	    is_cooperation: number;
	    ugc_pay_preview: number;
	    no_background: number;
	    clean_mode: number;
	    is_stein_gate: number;
	    is_360: number;
	    no_share: number;
	    arc_pay: number;
	    free_watch: number;
	
	    static createFrom(source: any = {}) {
	        return new Rights(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.bp = source["bp"];
	        this.elec = source["elec"];
	        this.download = source["download"];
	        this.movie = source["movie"];
	        this.pay = source["pay"];
	        this.hd5 = source["hd5"];
	        this.no_reprint = source["no_reprint"];
	        this.autoplay = source["autoplay"];
	        this.ugc_pay = source["ugc_pay"];
	        this.is_cooperation = source["is_cooperation"];
	        this.ugc_pay_preview = source["ugc_pay_preview"];
	        this.no_background = source["no_background"];
	        this.clean_mode = source["clean_mode"];
	        this.is_stein_gate = source["is_stein_gate"];
	        this.is_360 = source["is_360"];
	        this.no_share = source["no_share"];
	        this.arc_pay = source["arc_pay"];
	        this.free_watch = source["free_watch"];
	    }
	}
	export class SearchParams {
	    keyword: string;
	    page: string;
	
	    static createFrom(source: any = {}) {
	        return new SearchParams(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.keyword = source["keyword"];
	        this.page = source["page"];
	    }
	}
	export class SearchResultItem {
	    type: string;
	    id: number;
	    author: string;
	    mid: number;
	    typeid: string;
	    typename: string;
	    arcurl: string;
	    aid: number;
	    bvid: string;
	    title: string;
	    description: string;
	    arcrank: string;
	    pic: string;
	    play: number;
	    video_review: number;
	    favorites: number;
	    tag: string;
	    review: number;
	    pubdate: number;
	    senddate: number;
	    duration: string;
	    badgepay: boolean;
	    hit_columns?: string[];
	    view_type: string;
	    is_pay: number;
	    is_union_video: number;
	    rec_tags?: string[];
	    new_rec_tags?: string[];
	    rank_score: number;
	    like: number;
	    upic: string;
	    corner: string;
	    cover: string;
	    desc: string;
	    url: string;
	    rec_reason: string;
	    danmaku: number;
	    biz_data?: string[];
	    is_charge_video: number;
	    vt: number;
	    enable_vt: number;
	    vt_display: string;
	    subtitle: string;
	    episode_count_text: string;
	    release_status: number;
	    is_intervene: number;
	    origin: string;
	
	    static createFrom(source: any = {}) {
	        return new SearchResultItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.type = source["type"];
	        this.id = source["id"];
	        this.author = source["author"];
	        this.mid = source["mid"];
	        this.typeid = source["typeid"];
	        this.typename = source["typename"];
	        this.arcurl = source["arcurl"];
	        this.aid = source["aid"];
	        this.bvid = source["bvid"];
	        this.title = source["title"];
	        this.description = source["description"];
	        this.arcrank = source["arcrank"];
	        this.pic = source["pic"];
	        this.play = source["play"];
	        this.video_review = source["video_review"];
	        this.favorites = source["favorites"];
	        this.tag = source["tag"];
	        this.review = source["review"];
	        this.pubdate = source["pubdate"];
	        this.senddate = source["senddate"];
	        this.duration = source["duration"];
	        this.badgepay = source["badgepay"];
	        this.hit_columns = source["hit_columns"];
	        this.view_type = source["view_type"];
	        this.is_pay = source["is_pay"];
	        this.is_union_video = source["is_union_video"];
	        this.rec_tags = source["rec_tags"];
	        this.new_rec_tags = source["new_rec_tags"];
	        this.rank_score = source["rank_score"];
	        this.like = source["like"];
	        this.upic = source["upic"];
	        this.corner = source["corner"];
	        this.cover = source["cover"];
	        this.desc = source["desc"];
	        this.url = source["url"];
	        this.rec_reason = source["rec_reason"];
	        this.danmaku = source["danmaku"];
	        this.biz_data = source["biz_data"];
	        this.is_charge_video = source["is_charge_video"];
	        this.vt = source["vt"];
	        this.enable_vt = source["enable_vt"];
	        this.vt_display = source["vt_display"];
	        this.subtitle = source["subtitle"];
	        this.episode_count_text = source["episode_count_text"];
	        this.release_status = source["release_status"];
	        this.is_intervene = source["is_intervene"];
	        this.origin = source["origin"];
	    }
	}
	export class SearchResponse {
	    page: number;
	    pagesize: number;
	    numResults: number;
	    numPages: number;
	    result: SearchResultItem[];
	
	    static createFrom(source: any = {}) {
	        return new SearchResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.page = source["page"];
	        this.pagesize = source["pagesize"];
	        this.numResults = source["numResults"];
	        this.numPages = source["numPages"];
	        this.result = this.convertValues(source["result"], SearchResultItem);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class SignData {
	    img_key: string;
	    sub_key: string;
	
	    static createFrom(source: any = {}) {
	        return new SignData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.img_key = source["img_key"];
	        this.sub_key = source["sub_key"];
	    }
	}
	export class SpiData {
	    b_3: string;
	    b_4: string;
	
	    static createFrom(source: any = {}) {
	        return new SpiData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.b_3 = source["b_3"];
	        this.b_4 = source["b_4"];
	    }
	}
	export class Supportformat {
	    quality: number;
	    format: string;
	    new_description: string;
	    display_desc: string;
	    superscript: string;
	    codecs?: any;
	
	    static createFrom(source: any = {}) {
	        return new Supportformat(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.quality = source["quality"];
	        this.format = source["format"];
	        this.new_description = source["new_description"];
	        this.display_desc = source["display_desc"];
	        this.superscript = source["superscript"];
	        this.codecs = source["codecs"];
	    }
	}
	export class VideoDetailPage {
	    cid: number;
	    page: number;
	    from: string;
	    part: string;
	    duration: number;
	    vid: string;
	    weblink: string;
	    dimension: Dimension;
	    first_frame: string;
	
	    static createFrom(source: any = {}) {
	        return new VideoDetailPage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.cid = source["cid"];
	        this.page = source["page"];
	        this.from = source["from"];
	        this.part = source["part"];
	        this.duration = source["duration"];
	        this.vid = source["vid"];
	        this.weblink = source["weblink"];
	        this.dimension = this.convertValues(source["dimension"], Dimension);
	        this.first_frame = source["first_frame"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class VideoDetailResponse {
	    bvid: string;
	    aid: number;
	    videos: number;
	    tid: number;
	    tname: string;
	    copyright: number;
	    pic: string;
	    title: string;
	    pubdate: number;
	    ctime: number;
	    desc: string;
	    desc_v2: Descv2[];
	    state: number;
	    duration: number;
	    rights: Rights;
	    owner: Owner;
	    argue_info: Argueinfo;
	    dynamic: string;
	    cid: number;
	    dimension: Dimension;
	    pages: VideoDetailPage[];
	    // Go type: Subtitle
	    subtitle: any;
	
	    static createFrom(source: any = {}) {
	        return new VideoDetailResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.bvid = source["bvid"];
	        this.aid = source["aid"];
	        this.videos = source["videos"];
	        this.tid = source["tid"];
	        this.tname = source["tname"];
	        this.copyright = source["copyright"];
	        this.pic = source["pic"];
	        this.title = source["title"];
	        this.pubdate = source["pubdate"];
	        this.ctime = source["ctime"];
	        this.desc = source["desc"];
	        this.desc_v2 = this.convertValues(source["desc_v2"], Descv2);
	        this.state = source["state"];
	        this.duration = source["duration"];
	        this.rights = this.convertValues(source["rights"], Rights);
	        this.owner = this.convertValues(source["owner"], Owner);
	        this.argue_info = this.convertValues(source["argue_info"], Argueinfo);
	        this.dynamic = source["dynamic"];
	        this.cid = source["cid"];
	        this.dimension = this.convertValues(source["dimension"], Dimension);
	        this.pages = this.convertValues(source["pages"], VideoDetailPage);
	        this.subtitle = this.convertValues(source["subtitle"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class VideoUrlResponse {
	    from: string;
	    result: string;
	    message: string;
	    quality: number;
	    format: string;
	    timelength: number;
	    accept_format: string;
	    accept_description: string[];
	    accept_quality: number[];
	    video_codecid: number;
	    seek_param: string;
	    seek_type: string;
	    durl: Durl[];
	    support_formats: Supportformat[];
	    high_format?: any;
	    last_play_time: number;
	    last_play_cid: number;
	
	    static createFrom(source: any = {}) {
	        return new VideoUrlResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.from = source["from"];
	        this.result = source["result"];
	        this.message = source["message"];
	        this.quality = source["quality"];
	        this.format = source["format"];
	        this.timelength = source["timelength"];
	        this.accept_format = source["accept_format"];
	        this.accept_description = source["accept_description"];
	        this.accept_quality = source["accept_quality"];
	        this.video_codecid = source["video_codecid"];
	        this.seek_param = source["seek_param"];
	        this.seek_type = source["seek_type"];
	        this.durl = this.convertValues(source["durl"], Durl);
	        this.support_formats = this.convertValues(source["support_formats"], Supportformat);
	        this.high_format = source["high_format"];
	        this.last_play_time = source["last_play_time"];
	        this.last_play_cid = source["last_play_cid"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

