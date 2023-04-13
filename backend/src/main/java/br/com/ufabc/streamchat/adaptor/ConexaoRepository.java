package br.com.ufabc.streamchat.adaptor;

import br.com.ufabc.streamchat.entity.Conexao;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ConexaoRepository extends CrudRepository<Conexao, String> {
    List<Conexao> findAll();
    Conexao findByUsuario(String usuario);
    Conexao findByIdSessao(String idSessao);
}
