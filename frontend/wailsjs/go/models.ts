export namespace app_base {
	
	export class Config {
	    proxy_server_port: number;
	    config_dir: string;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.proxy_server_port = source["proxy_server_port"];
	        this.config_dir = source["config_dir"];
	    }
	}

}

export namespace app_bili {
	
	export class Config {
	    sign_data: bili_sdk.SignData;
	    spi_data: bili_sdk.SpiData;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.sign_data = this.convertValues(source["sign_data"], bili_sdk.SignData);
	        this.spi_data = this.convertValues(source["spi_data"], bili_sdk.SpiData);
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

export namespace bb_type {
	
	export class DownloadMusicParams {
	    id: string;
	    origin: string;
	    name: string;
	    download_dir: string;
	
	    static createFrom(source: any = {}) {
	        return new DownloadMusicParams(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.origin = source["origin"];
	        this.name = source["name"];
	        this.download_dir = source["download_dir"];
	    }
	}
	export class MusicItem {
	    id: string;
	    cover: string;
	    name: string;
	    duration: number;
	    author: string;
	    origin: string;
	
	    static createFrom(source: any = {}) {
	        return new MusicItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.cover = source["cover"];
	        this.name = source["name"];
	        this.duration = source["duration"];
	        this.author = source["author"];
	        this.origin = source["origin"];
	    }
	}
	export class SearchItem {
	    id: string;
	    cover: string;
	    name: string;
	    duration: number;
	    author: string;
	    type: string;
	    origin: string;
	    musicList: MusicItem[];
	
	    static createFrom(source: any = {}) {
	        return new SearchItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.cover = source["cover"];
	        this.name = source["name"];
	        this.duration = source["duration"];
	        this.author = source["author"];
	        this.type = source["type"];
	        this.origin = source["origin"];
	        this.musicList = this.convertValues(source["musicList"], MusicItem);
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
	export class SearchResponse {
	    current: number;
	    total: number;
	    pageSize: number;
	    data: SearchItem[];
	
	    static createFrom(source: any = {}) {
	        return new SearchResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.current = source["current"];
	        this.total = source["total"];
	        this.pageSize = source["pageSize"];
	        this.data = this.convertValues(source["data"], SearchItem);
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

export namespace bili_sdk {
	
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

}

