package com.ssafy.barguni.api.user;

import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.basket.service.BasketService;
import com.ssafy.barguni.api.error.ErrorResVO;
import com.ssafy.barguni.api.error.Exception.BasketException;
import com.ssafy.barguni.api.error.Exception.UsersException;
import com.ssafy.barguni.api.user.vo.OauthProfileinfo;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletResponse;

import java.util.Optional;

import static com.ssafy.barguni.api.error.ErrorCode.*;
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final HttpServletResponse response;
    private final BasketService basketService;

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).get();
    }

    public User findById(Long id) {
        User user = userRepository.getById(id);
        if(user == null)
            throw new UsersException(new ErrorResVO(USER_NOT_FOUNDED));
        return user;
    }

    public User findByIdWithBasket(Long id) {
        User user = userRepository.findByIdWithBasket(id);
        if(user == null)
            throw new UsersException(new ErrorResVO(USER_NOT_FOUNDED));
        return user;
    }

    public Boolean isDuplicated(String email) {
        return userRepository.existsByEmail(email);
    }

    public User oauthSignup(String email, String name) {
        User user = new User(email, name);
        userRepository.save(user);
        return user;
    }

    public Optional<User> changeUser(Long userId, String newName) {
        User user = userRepository.findById(userId).get();

        if (newName != null) {
            user.setName(newName);
        }

        return Optional.ofNullable(user);
    }

    public void deleteById(Long id) {
        User user = userRepository.getById(id);
        if(user == null)
            throw new UsersException(new ErrorResVO(USER_NOT_FOUNDED));

        // 유저 탈퇴시 참여한 바구니, 갖고있는 아이템 등등 다 삭제....???
        userRepository.deleteById(id);
    }

    public void modifyDefault(Long userId, Basket defaultBasket) {
        User user = userRepository.getById(userId);

        if(user == null)
            throw new UsersException(new ErrorResVO(USER_NOT_FOUNDED));
        if(defaultBasket == null)
            throw new BasketException(new ErrorResVO(BASKET_NOT_FOUNDED));

        userRepository.modifyDefault(userId, defaultBasket);
    }

    public User oauthSignup(OauthProfileinfo emailAndName) {
        User user = new User(emailAndName.getEmail(), emailAndName.getName());
        userRepository.save(user);
        String bktName = user.getName() + "의 바구니";
        Long bktId = basketService.createBasket(bktName, null, user);
        Basket basket = basketService.getBasket(bktId);
        user.setDefaultBasket(basket);
        userRepository.save(user);
        return user;
    }
}
