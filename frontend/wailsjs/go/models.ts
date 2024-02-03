export namespace biliClient {
	
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
	    }
	}
	export class SearchResponse {
	    pagesize: number;
	    numResults: number;
	    numPages: number;
	    result: SearchResultItem[];
	
	    static createFrom(source: any = {}) {
	        return new SearchResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
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

}

