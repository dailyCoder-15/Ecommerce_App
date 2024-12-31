package in.krloyar.ecommerce.configs;


import jakarta.persistence.EntityManager;

import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager em;

    @Autowired
    MyDataRestConfig(EntityManager em){
        this.em = em;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        Set<EntityType<?>> entities =em.getMetamodel().getEntities();
        List<Class> entityClass = new ArrayList<>();

        for(EntityType tempEntity: entities){
            entityClass.add(tempEntity.getJavaType());
        }

        Class[] domainTypes = entityClass.toArray(new Class[0]);

        config.exposeIdsFor(domainTypes);
    }
}
