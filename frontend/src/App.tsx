import './App.css';
import {useEffect, useState} from 'react';
import { Search } from '../wailsjs/go/app/App';
import {biliClient} from "../wailsjs/go/models";
import SearchResultItem = biliClient.SearchResultItem;
function App() {
  const [searchForm,setSearchForm]=useState({
    keyword: '',
    page:1
  })
  useEffect(() => {
    if (!searchForm.keyword) return
    Search({
      keyword: searchForm.keyword,
      page: searchForm.page + ''
    }).then((res) => {
      console.log('res: ', res);
      setList(res.result)
    });
  }, [searchForm.page]);
  const [list,setList]=useState<SearchResultItem[]>([])
  return <div id='App'>
    <input type="text" value={searchForm.keyword} onChange={e=>{
      setSearchForm((s => {
        return {
          ...s,
          keyword: e.target.value
        }
      }))
    }}/>
    <button onClick={()=>{
      Search({
        keyword: searchForm.keyword,
        page: searchForm.page + ''
      }).then((res) => {
        console.log('res: ', res);
        setList(res.result)
      });
    }}>搜索</button>
    <button onClick={()=>{
      setSearchForm(s => ({...s,page: s.page-1}))
    }}>上一页</button>
    <button onClick={()=>{
      setSearchForm(s => ({...s,page: s.page+1}))
    }}>
      下一页</button>

    <ul>
      {
        list.map((item )=>{
          return <li key={item.id}>{item.title}</li>
        })
      }
    </ul>
  </div>;
}

export default App;
