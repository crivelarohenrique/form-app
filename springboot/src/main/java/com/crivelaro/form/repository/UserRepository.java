package com.crivelaro.form.repository;

import com.crivelaro.form.model.User;
import org.springframework.beans.NullValueInNestedPathException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users where email = ?";
        try {
            User user = jdbcTemplate.queryForObject(sql,
                    (rs, rowNum) -> {
                User u = new User();
                u.setId(rs.getLong("id"));
                u.setEmail(rs.getString("email"));
                u.setPassword(rs.getString("password"));
                return u;
            }, email);
            assert user != null;
            return Optional.of(user);
        } catch(EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public void save(User user) {
        String sql = "INSERT INTO users (email, password) VALUES (?, ?)";
        jdbcTemplate.update(sql, user.getEmail(), user.getPassword());
    }
}
