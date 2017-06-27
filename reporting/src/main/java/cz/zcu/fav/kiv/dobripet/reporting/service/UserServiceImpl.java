package cz.zcu.fav.kiv.dobripet.reporting.service;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Mocked service, change for real implementation using dci users.
 */
@Service("userService")
@Transactional(value="dciTransactionManager")
public class UserServiceImpl implements UserService{

    @Override
    public int getCurrentUserId() {
        return 1;
    }
}
