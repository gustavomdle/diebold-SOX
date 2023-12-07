import * as React from 'react';
//import styles from './SoxHome.module.scss';
import { ISoxHomeProps } from './ISoxHomeProps';
import { escape } from '@microsoft/sp-lodash-subset';

import * as jquery from 'jquery';
import * as $ from "jquery";
import * as jQuery from "jquery";
import "bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
//Import from @pnp/sp    
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import { Web } from "sp-pnp-js";

import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { selectFilter } from 'react-bootstrap-table2-filter';
import { numberFilter } from 'react-bootstrap-table2-filter';
import { Comparator } from 'react-bootstrap-table2-filter';
import cellEditFactory from 'react-bootstrap-table2-editor'

//import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
//import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { Checkbox } from 'office-ui-fabric-react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faUserGear } from "@fortawesome/free-solid-svg-icons";
import { faUsersViewfinder } from "@fortawesome/free-solid-svg-icons";
import { faSheetPlastic } from "@fortawesome/free-solid-svg-icons";

require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../../../../css/estilos.css");

var _itemCountRevisoesFinalizadasOwner = 0;
var _temAvaliacaoGestor = 0;
var _itemCountRevisoesFinalizadasGestor = 0;
var _temAvaliacaoOwner = 0;
var _loginRede;
var _quarter;
var _ano;
var _currentUser;
var _grupos = [];
var _web;


export default class SoxHome extends React.Component<ISoxHomeProps, {}> {


  public async componentDidMount() {

    _web = new Web(this.props.context.pageContext.web.absoluteUrl);

    await _web.currentUser.get().then(f => {
      console.log("user", f);
      var id = f.Id;
      _currentUser = f.Title;

      console.log("_currentUser", _currentUser);

      var grupos = [];

      jQuery.ajax({
        url: `${this.props.siteurl}/_api/web/GetUserById(${id})/Groups`,
        type: "GET",
        headers: { 'Accept': 'application/json; odata=verbose;' },
        async: false,
        success: async function (resultData) {

          console.log("resultDataGrupo", resultData);

          if (resultData.d.results.length > 0) {

            for (var i = 0; i < resultData.d.results.length; i++) {

              grupos.push(resultData.d.results[i].Title);

            }

          }

        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }

      })

      console.log("grupos", grupos);
      _grupos = grupos;
    })


    this.getConfiguracao();
    this.getNomeUsuario();
    this.getMostrarStatus();


  }



  public render(): React.ReactElement<ISoxHomeProps> {
    return (

      <div>

        <h3 id='txtTitulo'></h3>

        <br></br><br></br>

        <div>
          <div className="form-group hidden" id='conteudoRevisaoGestorNaoNecessita' >
            <div className="form-row">
              <div className="col-md-1">
                <FontAwesomeIcon icon={faThumbsUp} size="3x" className='text-info' ></FontAwesomeIcon>
              </div>
              <div className="col-md gray botosRevisao">
                <h5>Você não necessita realizar a Revisão do Gestor do Perfil</h5>
              </div>
            </div>
          </div>

          <div className="form-group hidden" id='conteudoRevisaoGestorJaRealizou'>
            <div className="form-row">
              <div className="col-md-1">
                <FontAwesomeIcon icon={faCheck} size="3x" className='text-success'></FontAwesomeIcon>
              </div>
              <div className="col-md gray botosRevisao">
                <h5>Você já realizou sua Revisão do Gestor de Perfil</h5>
              </div>
            </div>
          </div>

          <div className="form-group hidden" id='conteudoRevisaoGestorRevisar'>
            <div className="form-row">
              <div className="col-md-1">
                <FontAwesomeIcon icon={faSheetPlastic} size="3x" className='text-warning'></FontAwesomeIcon>
              </div>
              <div className="col-md gray botosRevisao">
                <h5 ><a onClick={(e) => this.abrirRevisaoGestor()} href="#">Realizar a Revisão do Gestor do Perfil</a></h5>
              </div>
            </div>
          </div>



          <div className="form-group hidden" id='conteudoRevisaoOwnerNaoNecessita'>
            <div className="form-row">
              <div className="col-md-1">
                <FontAwesomeIcon icon={faThumbsUp} size="3x" className='text-info'></FontAwesomeIcon>
              </div>
              <div className="col-md gray botosRevisao">
                <h5>Você não necessita realizar a Revisão do Owner de Programa</h5>
              </div>
            </div>
          </div>

          <div className="form-group hidden" id='conteudoRevisaoOwnerJaRealizou'>
            <div className="form-row">
              <div className="col-md-1">
                <FontAwesomeIcon icon={faCheck} size="3x" className='text-success'></FontAwesomeIcon>
              </div>
              <div className="col-md gray botosRevisao">
                <h5>Você já realizou sua Revisão do Owner de Programa</h5>
              </div>
            </div>
          </div>

          <div className="form-group hidden" id='conteudoRevisaoOwnerRevisar'>
            <div className="form-row">
              <div className="col-md-1">
                <FontAwesomeIcon icon={faSheetPlastic} size="3x" className='text-warning'></FontAwesomeIcon>
              </div>
              <div className="col-md gray botosRevisao">
                <h5><a onClick={(e) => this.abrirRevisaoOwner()} href="#">Realizar a Revisão do Owner de Programa</a></h5>
              </div>
            </div>
          </div>

        </div >

      </div>
    );
  }


  protected async getNomeUsuario() {

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Gestores')/items?$top=4999&$orderby= ID desc&$select=*&$filter=Title eq '${_currentUser}' and Ano eq '${_ano}' and Quarter eq '${_quarter}'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        console.log("resultData", resultData);

        var arrProducao = [];
        var arrAssistenciaTecnica = [];

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            _loginRede = resultData.d.results[i].LoginRede;

            console.log("loginRede", _loginRede);

          }

        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }

    });

  }


  protected async getConfiguracao() {

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Configuracoes')/items?$top=1&$orderby= ID desc&$select=*&$filter=Title eq 'Ano'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            _ano = resultData.d.results[i].Valor;

            console.log("_ano", _ano);

          }

        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }

    });


    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Configuracoes')/items?$top=1&$orderby= ID desc&$select=*&$filter=Title eq 'Quarter'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            _quarter = resultData.d.results[i].Valor;

            console.log("_quarter", _quarter);

          }

        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }

    });



  }



  protected async getMostrarStatus() {

    if (_quarter == "01") var quarter = "I";
    else if (_quarter == "02") var quarter = "II";
    else if (_quarter == "03") var quarter = "III";
    else if (_quarter == "04") var quarter = "IV";

    jQuery("#txtTitulo").html(`Minhas revisões pendentes - Quarter ${quarter} ${_ano}`);







    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Revisão do Gestor do Perfil')/items?$top=4999&$orderby= Created desc&$select=*&$filter=Gestor eq '${_loginRede}' and Ano eq '${_ano}' and Quarter eq '${_quarter}'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length > 0) {

          _temAvaliacaoGestor = resultData.d.results.length;



        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }

    });


    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Revisões finalizadas')/items?$top=4999&$orderby= Created desc&$select=*&$filter=Usuario eq '${_loginRede}' and TipoRevisao eq 'Gestor X Perfil' and Ano eq '${_ano}' and Quarter eq '${_quarter}'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length > 0) {

          _itemCountRevisoesFinalizadasGestor = resultData.d.results.length;

        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }

    });

    console.log("_itemCountRevisoesFinalizadasGestor", _itemCountRevisoesFinalizadasGestor);


    if (_temAvaliacaoGestor > 0) {

      if (_itemCountRevisoesFinalizadasGestor > 0) {

        jQuery("#conteudoRevisaoGestorJaRealizou").show();


      } else {

        jQuery("#conteudoRevisaoGestorRevisar").show();

      }

    } else {

      jQuery("#conteudoRevisaoGestorNaoNecessita").show();

    }


    //////////////////////////


    if (_loginRede.includes("gardee")) {

      console.log("login gardee");
      var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Revisão do Owner de Programa')/items?$top=4999&$orderby= Created desc&$select=*&$filter=Filtro eq  'gardee1'`;


    }

    else if (_loginRede.includes("romanj")) {

      console.log("login romanj");
      var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Revisão do Owner de Programa')/items?$top=4999&$orderby= Created desc&$select=*&$filter=Filtro eq  'romanj1'`;


    }

    else {

      var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Revisão do Owner de Programa')/items?$top=4999&$orderby= Created desc&$select=*&$filter=Title eq '${_loginRede}'`;

    }


    jQuery.ajax({
      url: url,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length > 0) {

          _temAvaliacaoOwner = resultData.d.results.length;



        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }

    });


    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Revisões finalizadas')/items?$top=4999&$orderby= Created desc&$select=*&$filter=Usuario eq '${_loginRede}' and TipoRevisao eq 'Owner X Programa' and Ano eq '${_ano}' and Quarter eq '${_quarter}'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length > 0) {

          _itemCountRevisoesFinalizadasOwner = resultData.d.results.length;

        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }

    });


    console.log("_temAvaliacaoOwner", _temAvaliacaoOwner);
    console.log("_itemCountRevisoesFinalizadasOwner", _itemCountRevisoesFinalizadasOwner);

    if (_temAvaliacaoOwner > 0) {

      if (_itemCountRevisoesFinalizadasOwner > 0) {

        jQuery("#conteudoRevisaoOwnerJaRealizou").show();

      } else {

        jQuery("#conteudoRevisaoOwnerRevisar").show();

      }

    } else {

      jQuery("#conteudoRevisaoOwnerNaoNecessita").show();

    }




  }


  protected async abrirRevisaoGestor() {

    var caminho = this.props.context.pageContext.web.serverRelativeUrl;

    window.location.href = `${caminho}/SitePages/Revisão-do-Gestor-do-Perfil.aspx`;

  }

  protected async abrirRevisaoOwner() {

    var caminho = this.props.context.pageContext.web.serverRelativeUrl;

    window.location.href = `${caminho}/SitePages/Revisão-do-Owner-de-Programa.aspx`;

  }



}
