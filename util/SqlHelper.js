exports.getUserSql = (email) => {
    return "SELECT email, pin, r.role, r.roleID, u.userID, active, term, logo, status FROM user as u " +
        "inner join user_role as ur on  ur.userID = u.userID " +
        "inner join role as r on r.roleID = ur.roleID " +
        "WHERE lower(u.email) = " + "'" + email + "'";
}

exports.getAccountByUserIdSql = (userID) => {
    return "select uc.level, uc.customerID, c.resellerID from user_customer as uc left join customer " +
        "as c on uc.customerID = c.customerID where uc.userID = " + userID;
}

exports.getALLCustomersSql = () => {
    return "select * from customer where resellerID != 0";
}

exports.getAllResellerList = () => {
    return "select * from customer where resellerID = 0";
}

exports.getCustomerListByResellerID = (resellerID) => {
    return "select * from customer where resellerID = " + resellerID;
}

exports.getUIModulesByRoleID = (roleID) => {
    let sql =  "SELECT m.moduleID, m.name, m.parentID from module as m " +
        "inner join role_module as rm on rm.moduleID = m.moduleID " +
        "inner join role as r on rm.roleID = r.roleID " +
        "where r.roleID = " + roleID + " order by m.level, m.parentID, m.moduleID";
    return sql;
}