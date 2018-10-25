import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Pagination from "react-pagination-library";
import "react-pagination-library/build/css/index.css"; //for css
import Modal from 'react-awesome-modal';
import { initializeIcons } from '@uifabric/icons';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import 'office-ui-fabric-react/lib-amd/components/MessageBar/examples/MessageBar.Basic.Example.scss';
import "office-ui-fabric-react/lib-amd/components/SearchBox/examples/SearchBox.Small.Example.scss";
import 'office-ui-fabric-react/lib-amd/components/Spinner/examples/Spinner.Basic.Example.scss';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      news: [],
      showItems: 4,
      currentPage: 1,
      visible: false,
      isLoading: false,
      error: null
    }
  }


  componentDidMount(){
    initializeIcons();
    this.getMoviesFromApiAsync();
  }

  getMoviesFromApiAsync() {
    this.setState({currentPage:1, isLoading: true});
    var searchInput = arguments[0];
    if(!searchInput) searchInput="opinion";
    var url = "https://api.nytimes.com/svc/topstories/v2/";
    var key = ".json?api-key=dd4583599e114a73863a5bfa343a0843";
    url += searchInput+key;
    return fetch(url)
    .then(response => {
      if(response.ok){
        return response.json();
      }else{
        throw new Error('Something went wrong ...');
      }
    })
    .then(responseJson => 
      this.setState({
        news: responseJson.results,
        isLoading: false
      })
    )
    .catch((error) => {
      this.setState({
        error, 
        isLoading: false
      });
    });
  }


  getNews = () => {
   const {news} = this.state;
   const {showItems} = this.state;
   const {currentPage} = this.state;
   var firstData = (currentPage-1)*showItems;
   return news.slice(firstData, firstData+showItems).map(news => 
    <div className="news-div" key={news.id}>
     {news.multimedia[3] != null ?<img src={news.multimedia[3].url} alt="" className="news-photo"></img> : <img src="https://bit.ly/2PgYGul" alt="" className="news-photo"></img>}

      <div onClick={this.showModal.bind(null,news)}>
        <p className="news-headline" >{news.title}</p>
        <p className="news-body">{news.abstract}</p>
        <p className="news-body">{news.byline}</p>
      </div>
    </div>
    )
  }

  showModal = news=>{
    this.setState({
      visible:true
    });
    document.getElementById("news-modal-section").innerHTML = news.section;
    document.getElementById("news-modal-title").innerHTML = news.title;
    document.getElementById("news-modal-abstract").innerHTML = news.abstract;
    document.getElementById("news-modal-writer").innerHTML = news.byline;
    news.multimedia[4] != null ? document.getElementById("news-modal-image").src = news.multimedia[4].url : document.getElementById("news-modal-image").src = "https://bit.ly/2PgYGul";
    document.getElementById("news-modal-url").href = news.url;
  }

  changeCurrentPage = numPage => {
  this.setState({ currentPage: numPage });
  };

  searchArticle = (value) =>{
    this.getMoviesFromApiAsync(value);
  }


  openModal() {
    this.setState({
        visible : true
    });
  }

  closeModal() {
      this.setState({
          visible : false
      });
  }

  render() {
    const {news, isLoading, error} = this.state;
    if(error){
      return (
        <div>
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
            dismissButtonAriaLabel="Close"
          >
            Error section not found.{' '}
            <Link href=".">Please reload this page.</Link>
          </MessageBar>
        </div>
      )
    }
    if(isLoading){
      return (
      <div className="spinner-center">
        <Spinner 
          size={SpinnerSize.large} 
          label="Loading..." 
          ariaLive="assertive" 
        />
      </div>
      )
    }
    return (
      <div className="Apps">
        <div className="ms-SearchBoxSmallExample" style={{float:"right"}}>
          <SearchBox
            placeholder="Search"
            onSearch={newValue => {this.searchArticle(newValue);}}
          />
        </div>
        <div>
          <Pagination
              currentPage={this.state.currentPage}
              totalPages={Math.ceil(this.state.news.length/this.state.showItems)}
              changeCurrentPage={this.changeCurrentPage}
              theme="bottom-border"
              className="pagination"
          />
        </div>
        <div id="news-modal">
          <Modal 
              visible={this.state.visible}
              width="50%"
              height="100%"
              effect="fadeInUp"
              onClickAway={() => this.closeModal()}
          >
            <div className="news-modal-container">
                <h4 id="news-modal-section"></h4>
                <h1 id="news-modal-title">Titles</h1>
                <p id="news-modal-abstract"> Some Contents</p>
                <a id="news-modal-writer"></a>
                <img id="news-modal-image" className="news-modal-image"></img>
                <div><a id="news-modal-url">Read more</a></div>
                <a href="javascript:void(0);" onClick={() => this.closeModal()}>Close</a>
            </div>
          </Modal>
        </div>
        {this.getNews()}
      </div>
    );
  }
}
 
export default App;
