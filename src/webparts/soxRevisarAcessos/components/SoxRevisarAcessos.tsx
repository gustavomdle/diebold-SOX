import * as React from 'react';
//import styles from './SoxRevisarAcessos.module.scss';
import { ISoxRevisarAcessosProps } from './ISoxRevisarAcessosProps';
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
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../../../../css/estilos.css");

var _web;
var _caminho;
var _grupos = [];
var _currentUser;
var _loginRede;
var _temAvaliacaoOwner = 0;
var _itemCountRevisoesFinalizadasOwner = 0;
var _revisaoJaRealizada = false;
var _opcao;
var _temAvaliacaoGestor = 0;
var _itemCountRevisoesFinalizadasGestor = 0;
var _quarter;
var _ano;

export interface IShowEmployeeStates {
  itemsList: any[],

}

export default class SoxRevisarAcessos extends React.Component<ISoxRevisarAcessosProps, IShowEmployeeStates> {

  constructor(props: ISoxRevisarAcessosProps) {
    super(props);
    this.state = {
      itemsList: []
    }
  }

  public async componentDidMount() {

    _web = new Web(this.props.context.pageContext.web.absoluteUrl);
    _caminho = this.props.context.pageContext.web.serverRelativeUrl;

    document
      .getElementById("btnConfirmarFinalizarAnalise")
      .addEventListener("click", (e: Event) => this.confirmarFinalizarAnalise());

    document
      .getElementById("btnFinalizarAnaliseOwner")
      .addEventListener("click", (e: Event) => this.finalizarAnalise());

    document
      .getElementById("btnFinalizarAnaliseGestor")
      .addEventListener("click", (e: Event) => this.finalizarAnalise());


    document
      .getElementById("btnSucesso")
      .addEventListener("click", (e: Event) => this.fecharSucesso());

    jQuery("#conteudoLoading").html(`<br/><br/><img style="height: 80px; width: 80px" src='${_caminho}/SiteAssets/loading.gif'/>
      <br/>Aguarde....<br/><br/>
      `);


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

    //jQuery("#conteudoFinalizarAnalise").hide();
    //jQuery("#conteudoRevisaoNaoNecessaria").hide();
    //jQuery("#conteudoRevisaoJaRealizada").hide();

    this.getConfiguracao();
    this.getNomeUsuario();
    this.getRevisao();
    this.exibeBotao();


    jQuery("#conteudoFiltro").hide();

    //

  }


  public render(): React.ReactElement<ISoxRevisarAcessosProps> {



    // const cellEdit = cellEditFactory({
    //   mode: 'click',
    //   blurToSave: true,
    //   afterSaveCell: (oldValue, newValue, row) => {

    //     this.edit(oldValue, newValue, row);

    //   }

    // });

    const customFilter = textFilter({
      placeholder: ' ',  // custom the input placeholder
    });


    const paginationOptions = {
      sizePerPage: 100,
      hideSizePerPage: true,
      hidePageListOnlyOnePage: true
    };



    var empTablecolumns = [];

    var tipoVisualizacao = this.props.tipoVisualizacao;

    if (tipoVisualizacao == "Revisão do Gestor do Perfil") {

      empTablecolumns = [
        // {
        //   dataField: "Gestor",
        //   text: "Gestor",
        //   headerStyle: { backgroundColor: '#bee5eb' },
        //   sort: true,
        //   filter: customFilter,
        //   editable: false,

        // },
        {
          dataField: "Produto",
          text: "Produto",
          headerStyle: { backgroundColor: '#bee5eb' },
          sort: true,
          filter: customFilter,
          editable: false,
        },
        {
          dataField: "Perfil",
          text: "Perfil",
          headerStyle: { backgroundColor: '#bee5eb' },
          sort: true,
          filter: customFilter,
          classes: 'text-center',
          editable: false,
        },
        {
          dataField: "Descricao",
          text: "Descrição",
          headerStyle: { backgroundColor: '#bee5eb' },
          sort: true,
          filter: customFilter,
          editable: false,
        },
        {
          dataField: "Usuario",
          text: "Usuário",
          headerStyle: { backgroundColor: '#bee5eb' },
          sort: true,
          filter: customFilter,
          editable: false,
        },
        {
          dataField: "Title",
          text: "Title",
          headerStyle: { backgroundColor: '#bee5eb' },
          sort: true,
          filter: customFilter,
          editable: false,
        },
        {
          dataField: "Remover",
          text: "Remover?",
          headerStyle: { backgroundColor: '#bee5eb' },
          sort: true,
          filter: customFilter,
          classes: 'text-center',
          editable: false,
        },
        {
          dataField: "",
          text: "",
          headerStyle: { "backgroundColor": "#bee5eb", "width": "160px" },
          editable: false,
          classes: 'text-center',
          formatter: (rowContent, row) => {
            var id = row.ID;
            var remover = row.Remover;

            if (remover == "Sim") {

              return (

                <button onClick={(e) => this.alteraPermissao(id, "Revisão do Gestor do Perfil", "Não")} style={{ "width": "140px" }} className="btn btn-info btnCustom btn-sm">Conceder Acesso</button>

              )

            }

            else if (remover == "Não") {

              return (
                <button onClick={(e) => this.alteraPermissao(id, "Revisão do Gestor do Perfil", "Sim")} style={{ "width": "140px" }} className="btn btn-secondary btnCustom btn-sm">Remover Acesso</button>

              )

            }

          }
        }

      ]


    }


    else if (tipoVisualizacao == "Revisão do Owner de Programa") {


      empTablecolumns = [
        {
          dataField: "Modulo",
          text: "Módulo",
          headerStyle: { backgroundColor: '#bee5eb' },
          sort: true,
          filter: customFilter,
          editable: false,
        },
        {
          dataField: "CodigoPrograma",
          text: "Código Programa",
          headerStyle: { backgroundColor: '#bee5eb' },
          sort: true,
          filter: customFilter,
          classes: 'text-center',
          editable: false,
        },
        {
          dataField: "NomePrograma",
          text: "Nome Programa",
          headerStyle: { backgroundColor: '#bee5eb' },
          sort: true,
          filter: customFilter,
          editable: false,
        },
        {
          dataField: "Rotina",
          text: "Rotina",
          headerStyle: { backgroundColor: '#bee5eb' },
          sort: true,
          filter: customFilter,
          editable: false,
        },
        {
          dataField: "Perfil",
          text: "Perfil",
          headerStyle: { backgroundColor: '#bee5eb' },
          sort: true,
          filter: customFilter,
          classes: 'text-center',
          editable: false,
        },
        {
          dataField: "DescricaoPerfil",
          text: "Descrição Perfil",
          headerStyle: { backgroundColor: '#bee5eb' },
          sort: true,
          filter: customFilter,
          editable: false,
        },
        {
          dataField: "gestor",
          text: "Gestor",
          headerStyle: { backgroundColor: '#bee5eb' },
          sort: true,
          filter: customFilter,
          editable: false,
        },
        {
          dataField: "Produto",
          text: "Produto",
          headerStyle: { backgroundColor: '#bee5eb' },
          sort: true,
          filter: customFilter,
          editable: false,
        },
        {
          dataField: "Remover",
          text: "Remover?",
          headerStyle: { backgroundColor: '#bee5eb' },
          sort: true,
          filter: customFilter,
          classes: 'text-center',
          editable: false,
        },
        {
          dataField: "",
          text: "",
          headerStyle: { "backgroundColor": "#bee5eb", "width": "160px" },
          editable: false,
          classes: 'text-center',
          formatter: (rowContent, row) => {
            var id = row.ID;
            var remover = row.Remover;

            if (remover == "Sim") {

              return (

                <button onClick={(e) => this.alteraPermissao(id, "Revisão do Owner de Programa", "Não")} style={{ "width": "140px" }} className="btn btn-info btnCustom btn-sm botesAcesso">Conceder Acesso</button>

              )

            }

            else if (remover == "Não") {

              return (

                <button onClick={(e) => this.alteraPermissao(id, "Revisão do Owner de Programa", "Sim")} style={{ "width": "140px" }} className="btn btn-secondary btnCustom btn-sm botesAcesso">Remover Acesso</button>

              )

            }

          }
        }



      ]


    } else {

      empTablecolumns = [
        {
          dataField: "Title",
          text: "Title",
          headerStyle: { backgroundColor: '#bee5eb' },
          sort: true,
          filter: customFilter,
          editable: false,

        },
      ]

    }

    return (

      <><><>

        <div id="conteudoFinalizarAnalise" className='hidden'><button style={{ "margin": "2px" }} id="btnConfirmarFinalizarAnalise" className="btn btn-success">Finalizar Análise</button></div>
        <div id="conteudoRevisaoNaoNecessaria" className='hidden '><div className="p-3 mb-2 alert-danger text-dark rounded"><h4>Você não necessita realizar a revisão!</h4></div></div>
        <div id="conteudoRevisaoJaRealizada" className='hidden' ><div className="p-3 mb-2 alert-danger text-secondary rounded"><h4><FontAwesomeIcon icon={faCircleCheck} className="ico text-secondary" />&nbsp;Você já realizou sua revisão!</h4></div></div>
        <br id=""></br><br></br>


        <div className="form-group" id="conteudoFiltro">
          <div className="form-row">
            <div className="form-group col-md">
              <span>Revisão:</span>
              <select id="ddlFiltro" className="form-control" style={{ "width": "200px" }} onChange={(e) => this.onChangeFiltro(e.target.value)} >
                <option value="1" selected>Parte 1</option>
                <option value="2">Parte 2</option>
              </select>
            </div>
          </div>
        </div>


        <p>Resultado: <span className="text-info" id="txtCount"></span> registro(s) encontrado(s)</p>
        <div className="tabelaComScrool">
          <BootstrapTable bootstrap4 striped responsive condensed hover={false} className="gridTodosItensx" id="gridTodosItens" keyField='ID' data={this.state.itemsList} columns={empTablecolumns} cellsubmit='remote' headerClasses="header-class" pagination={paginationFactory(paginationOptions)} filter={filterFactory()} noDataIndication="Nenhum registro encontrado" />
        </div></><br></br><div className="text-right">

        </div></><div className="modal fade" id="modalCarregando" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div id='conteudoLoading' className='carregando'></div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalConfirmarFinalizarAnaliseOwner" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Eu certifico que analisei os acessos dos colaboradores que possuem a capacidade de atualizar os dados dos sistemas
                sob minha responsabilidade; e as alterações necessárias foram registradas neste relatório.
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnFinalizarAnaliseOwner" type="button" className="btn btn-primary">Finalizar Análise</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalConfirmarFinalizarAnaliseGestor" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Eu certifico que analisei os acessos dos colaboradores que possuem a capacidade de atualizar os dados dos sistemas sob minha responsabilidade;
                e as alterações necessárias foram registradas neste relatório.
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="btnFinalizarAnaliseGestor" type="button" className="btn btn-primary">Finalizar Análise</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalSucesso" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Alerta</h5>
              </div>
              <div className="modal-body">
                Análise Finalizado com sucesso!
              </div>
              <div className="modal-footer">
                <button type="button" id="btnSucesso" className="btn btn-primary">OK</button>
              </div>
            </div>
          </div>
        </div>


      </>

    );


  }

  protected async alteraPermissao(id, lista, opcao) {


    if (_revisaoJaRealizada) {

      alert("Você já realizou sua revisão!");
      return false;
    }

    jQuery("#modalCarregando").modal({ backdrop: 'static', keyboard: false });

    await _web.lists
      .getByTitle(lista)
      .items.getById(id).update({
        Remover: opcao,
      })
      .then(async response => {

        var tipoVisualizacao = this.props.tipoVisualizacao;

        if (tipoVisualizacao == "Revisão do Gestor do Perfil") {

          var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Revisão do Gestor do Perfil')/items?$top=4999&$orderby= Created desc&$select=*&$filter=Gestor eq '${_loginRede}'`;
        }

        else if (tipoVisualizacao == "Revisão do Owner de Programa") {

          var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Revisão do Owner de Programa')/items?$top=4999&$orderby= Created desc&$select=*&$filter=Title eq '${_loginRede}'`;
        }

        var reactHandlerGestor = this;

        jQuery.ajax({
          url: url,
          type: "GET",
          headers: { 'Accept': 'application/json; odata=verbose;' },
          success: function (resultData) {
            jQuery('#txtCount').html(resultData.d.results.length);
            reactHandlerGestor.setState({
              itemsList: resultData.d.results
            });

            jQuery("#modalCarregando").modal('hide');

          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
          }
        });


      }).catch(err => {
        console.log("err", err);
      });


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


  protected async getRevisao() {


    jQuery('#txtCount').html("0");

    var reactHandlerItems = this;

    var tipoVisualizacao = this.props.tipoVisualizacao;

    if (tipoVisualizacao == "Revisão do Gestor do Perfil") {
      var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Revisão do Gestor do Perfil')/items?$top=4999&$orderby= Created desc&$select=*&$filter=Gestor eq '${_loginRede}' and Ano eq '${_ano}' and Quarter eq '${_quarter}'`;
    }

    else if (tipoVisualizacao == "Revisão do Owner de Programa") {

      console.log("Revisão do Owner de Programa");

      console.log("_loginRede 2", _loginRede);


      if (_loginRede.includes("gardee")) {

        console.log("login gardee");
        var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Revisão do Owner de Programa')/items?$top=4999&$orderby= Created desc&$select=*&$filter=Filtro eq  'gardee1'`;

        setTimeout(async () => {
          jQuery("#conteudoFiltro").show();
        }, 1500);

      }

      else if (_loginRede.includes("romanj")) {

        console.log("login romanj");
        var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Revisão do Owner de Programa')/items?$top=4999&$orderby= Created desc&$select=*&$filter=Filtro eq  'romanj1'`;

        setTimeout(async () => {
          jQuery("#conteudoFiltro").show();
        }, 1500);

      }


      else {

        var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Revisão do Owner de Programa')/items?$top=4999&$orderby= Created desc&$select=*&$filter=Title eq '${_loginRede}' and Ano eq '${_ano}' and Quarter eq '${_quarter}'`;

      }

    }

    console.log("url", url);


    jQuery.ajax({
      url: url,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        jQuery('#txtCount').html(resultData.d.results.length);
        reactHandlerItems.setState({
          itemsList: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });



  }


  protected async exibeBotao() {

    var tipoVisualizacao = this.props.tipoVisualizacao;

    if (tipoVisualizacao == "Revisão do Gestor do Perfil") {

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

          jQuery("#conteudoRevisaoJaRealizada").show();

          _revisaoJaRealizada = true;


        } else {

          jQuery("#conteudoFinalizarAnalise").show();

        }

      } else {

        jQuery("#conteudoRevisaoNaoNecessaria").show();

      }



    }

    else if (tipoVisualizacao == "Revisão do Owner de Programa") {


      if (_loginRede.includes("gardee")) {

        console.log("login gardee");
        var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Revisão do Owner de Programa')/items?$top=4999&$orderby= Created desc&$select=*&$filter=Filtro eq  'gardee1'`;


      }

      else if (_loginRede.includes("romanj")) {

        console.log("login romanj");
        var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Revisão do Owner de Programa')/items?$top=4999&$orderby= Created desc&$select=*&$filter=Filtro eq  'romanj1'`;


      }

      else {

        var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Revisão do Owner de Programa')/items?$top=4999&$orderby= Created desc&$select=*&$filter=Title eq '${_loginRede}' and Ano eq '${_ano}' and Quarter eq '${_quarter}'`;

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

          jQuery("#conteudoRevisaoJaRealizada").show();

          _revisaoJaRealizada = true;


        } else {

          jQuery("#conteudoFinalizarAnalise").show();

        }

      } else {

        jQuery("#conteudoRevisaoNaoNecessaria").show();

      }



    }



  }



  protected confirmarFinalizarAnalise() {

    var reactHandlerSoftwares = this;

    var tipoVisualizacao = this.props.tipoVisualizacao;

    if (tipoVisualizacao == "Revisão do Gestor do Perfil") {

      _opcao = "Gestor X Perfil";
      jQuery("#modalConfirmarFinalizarAnaliseGestor").modal({ backdrop: 'static', keyboard: false });

    }

    else if (tipoVisualizacao == "Revisão do Owner de Programa") {

      _opcao = "Owner X Programa";
      jQuery("#modalConfirmarFinalizarAnaliseOwner").modal({ backdrop: 'static', keyboard: false });

    }


  }


  protected async finalizarAnalise() {

    //jQuery("#btnFinalizarAnaliseOwner").prop("disabled", true);
    //jQuery("#btnFinalizarAnaliseGestor").prop("disabled", true);
    jQuery("#modalConfirmarFinalizarAnaliseOwner").modal('hide');
    jQuery("#modalConfirmarFinalizarAnaliseGestor").modal('hide');
    jQuery("#modalCarregando").modal({ backdrop: 'static', keyboard: false });

    await _web.lists
      .getByTitle("Revisões finalizadas")
      .items.add({
        Title: _currentUser,
        Usuario: _loginRede,
        TipoRevisao: _opcao,
        Ano: _ano,
        Quarter: _quarter
      })
      .then(async response => {

        jQuery.ajax({
          url: `${this.props.siteurl}/_api/web/lists/getbytitle('Gestores')/items?$top=4999&$orderby= ID desc&$select=*&$filter=Title eq '${_currentUser}' and Ano eq '${_ano}' and Quarter eq '${_quarter}'`,
          type: "GET",
          async: false,
          headers: { 'Accept': 'application/json; odata=verbose;' },
          success: async function (resultData) {

            console.log("resultData", resultData);

            var arrProducao = [];
            var arrAssistenciaTecnica = [];

            if (resultData.d.results.length > 0) {

              for (var i = 0; i < resultData.d.results.length; i++) {

                var id = resultData.d.results[i].ID;

                if (_opcao == "Owner X Programa") {

                  await _web.lists
                    .getByTitle("Gestores")
                    .items.getById(id).update({
                      Owner: "Revisado",
                    })
                    .then(async response => {

                      jQuery("#btnFinalizarAnaliseOwner").prop("disabled", false);
                      jQuery("#btnFinalizarAnaliseGestor").prop("disabled", false);
                      jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false })

                    }).catch(err => {
                      console.log("err", err);
                    });

                }

                if (_opcao == "Gestor X Perfil") {

                  await _web.lists
                    .getByTitle("Gestores")
                    .items.getById(id).update({
                      Gestor: "Revisado",
                    })
                    .then(async response => {

                      jQuery("#modalConfirmarFinalizarAnaliseOwner").modal('hide');
                      jQuery("#modalConfirmarFinalizarAnaliseGestor").modal('hide');
                      jQuery("#btnFinalizarAnaliseOwner").prop("disabled", false);
                      jQuery("#btnFinalizarAnaliseGestor").prop("disabled", false);
                      jQuery("#modalSucesso").modal({ backdrop: 'static', keyboard: false })

                    }).catch(err => {
                      console.log("err", err);
                    });


                }



              }

            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
          }

        });

      }).catch(err => {
        console.log("err", err);
      });





  }


  protected async fecharSucesso() {

    jQuery("#modalSucesso").modal('hide');

    window.location.href = `Home.aspx`;

  }

  private onChangeFiltro = (val) => {

    if (val == "1") {

      if (_loginRede.includes("gardee")) {

        console.log("login gardee");
        var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Revisão do Owner de Programa')/items?$top=4999&$orderby= Created desc&$select=*&$filter=Filtro eq  'gardee1'`;

      }

      else if (_loginRede.includes("romanj")) {

        console.log("login romanj");
        var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Revisão do Owner de Programa')/items?$top=4999&$orderby= Created desc&$select=*&$filter=Filtro eq  'romanj1'`;

      }

    }


    else if (val == "2") {


      if (_loginRede.includes("gardee")) {

        console.log("login gardee");
        var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Revisão do Owner de Programa')/items?$top=4999&$orderby= Created desc&$select=*&$filter=Filtro eq  'gardee2'`;

      }

      else if (_loginRede.includes("romanj")) {

        var url = `${this.props.siteurl}/_api/web/lists/getbytitle('Revisão do Owner de Programa')/items?$top=4999&$orderby= Created desc&$select=*&$filter=Filtro eq  'romanj2'`;

      }


    }

    var reactHandlerItems = this;

    jQuery.ajax({
      url: url,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        jQuery('#txtCount').html(resultData.d.results.length);
        reactHandlerItems.setState({
          itemsList: resultData.d.results
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });






  }



}
