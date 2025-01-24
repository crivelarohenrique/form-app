package com.crivelaro.form.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AuthResponseDTO (
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    String email,
    String token
) { }
