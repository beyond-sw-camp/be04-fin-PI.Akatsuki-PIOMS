package com.akatsuki.pioms.specs.controller;


import com.akatsuki.pioms.specs.service.SpecsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SpecsController {
    private SpecsService specsService;

    @Autowired
    public SpecsController(SpecsService specsService) {
        this.specsService = specsService;
    }

    @GetMapping("/admin/specs")
    public ResponseEntity<List<ResponseSpecs>> getSpecsList(){
        return ResponseEntity.ok(specsService.getSpecsList());
    }
    @GetMapping("/admin/specs/{specsCode}")
    public ResponseEntity<ResponseSpecs> getSpecs(@PathVariable int specsCode){
        return ResponseEntity.ok(specsService.getSpecs(specsCode));
    }




}
