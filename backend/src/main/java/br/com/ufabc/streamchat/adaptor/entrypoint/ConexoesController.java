package br.com.ufabc.streamchat.adaptor.entrypoint;

import br.com.ufabc.streamchat.adaptor.ConexaoRepository;
import br.com.ufabc.streamchat.entity.Conexao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ConexoesController {

    @Autowired
    public ConexoesController(ConexaoRepository conexaoRepository) {
        this.conexaoRepository = conexaoRepository;
    }

    private final ConexaoRepository conexaoRepository;

    @GetMapping("/current/{id_sala}")
    public ResponseEntity<List<Conexao>> getCurrentUsers(@PathVariable(name = "id_sala") String id_sala) {
        return ResponseEntity.ok().body(conexaoRepository.findAllBySala(id_sala));
    }
}
