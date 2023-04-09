package br.com.ufabc.streamchat.adaptor;

import br.com.ufabc.streamchat.entity.Mensagem;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MensagemRepository extends CrudRepository<Mensagem, Long> {

}
